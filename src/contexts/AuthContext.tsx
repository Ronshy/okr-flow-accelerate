
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  getUserOKRs: () => any[];
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] useEffect dijalankan');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] getSession result:', session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange:', event, session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log('[AuthContext] fetchUserProfile dipanggil dengan:', supabaseUser);
    try {
      console.log('[AuthContext] sebelum request ke Supabase');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          department_id (
            id,
            name
          )
        `)
        .eq('id', supabaseUser.id)
        .single();
      console.log('[AuthContext] setelah request ke Supabase');
      console.log('[AuthContext] fetchUserProfile result:', { profile, error });

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          department: profile.department_id?.name || 'Engineering',
          position: 'Employee', // This could be added to profiles table later
          avatar: profile.name.split(' ').map(n => n[0]).join('')
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getUserOKRs = () => {
    // This will be implemented later to fetch real OKRs from database
    return [];
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/okr/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: error.message === 'User not found' 
            ? 'Email tidak terdaftar dalam sistem.' 
            : 'Terjadi kesalahan saat mengirim email reset password.'
        };
      }

      return {
        success: true,
        message: 'Email reset password telah dikirim. Silakan cek inbox Anda.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengirim email reset password.'
      };
    }
  };

  const updatePassword = async (password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        return {
          success: false,
          message: 'Terjadi kesalahan saat mengubah password.'
        };
      }

      return {
        success: true,
        message: 'Password berhasil diubah.'
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengubah password.'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
      getUserOKRs,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
