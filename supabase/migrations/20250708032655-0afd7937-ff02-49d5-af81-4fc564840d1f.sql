
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  head TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OKRs table
CREATE TABLE public.okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('individual', 'team', 'company')),
  type TEXT NOT NULL CHECK (type IN ('committed', 'aspirational')),
  deadline DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create key results table
CREATE TABLE public.key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES public.okrs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target TEXT NOT NULL,
  current TEXT DEFAULT '0',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'off-track')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for department_id in profiles
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_department 
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for departments
CREATE POLICY "Users can view all departments" ON public.departments FOR SELECT USING (true);

-- Create RLS policies for OKRs
CREATE POLICY "Users can view own individual OKRs" ON public.okrs FOR SELECT 
  USING (level = 'individual' AND owner_id = auth.uid());
CREATE POLICY "Users can view team OKRs from their department" ON public.okrs FOR SELECT 
  USING (level = 'team' AND department_id IN (
    SELECT department_id FROM public.profiles WHERE id = auth.uid()
  ));
CREATE POLICY "Users can view company OKRs" ON public.okrs FOR SELECT 
  USING (level = 'company');
CREATE POLICY "Users can create individual OKRs" ON public.okrs FOR INSERT 
  WITH CHECK (level = 'individual' AND owner_id = auth.uid());
CREATE POLICY "Users can update own individual OKRs" ON public.okrs FOR UPDATE 
  USING (level = 'individual' AND owner_id = auth.uid());
CREATE POLICY "Users can delete own individual OKRs" ON public.okrs FOR DELETE 
  USING (level = 'individual' AND owner_id = auth.uid());

-- Create RLS policies for key results
CREATE POLICY "Users can view key results of accessible OKRs" ON public.key_results FOR SELECT 
  USING (okr_id IN (
    SELECT id FROM public.okrs WHERE 
      (level = 'individual' AND owner_id = auth.uid()) OR
      (level = 'team' AND department_id IN (
        SELECT department_id FROM public.profiles WHERE id = auth.uid()
      )) OR
      level = 'company'
  ));
CREATE POLICY "Users can manage key results of own OKRs" ON public.key_results FOR ALL 
  USING (okr_id IN (
    SELECT id FROM public.okrs WHERE owner_id = auth.uid()
  ));

-- Insert sample departments
INSERT INTO public.departments (id, name, head) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Engineering', 'Alex Rodriguez'),
  ('22222222-2222-2222-2222-222222222222', 'Product', 'Emma Watson'),
  ('33333333-3333-3333-3333-333333333333', 'Marketing', 'Sarah Chen'),
  ('44444444-4444-4444-4444-444444444444', 'Sales', 'Robert Taylor');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, department_id)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), NEW.email),
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'department_id', ''), NULL)::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
