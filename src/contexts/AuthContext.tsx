
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Mock users data - in real app this would come from your backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    department: 'engineering',
    position: 'Engineering Manager',
    avatar: 'AR'
  },
  {
    id: '2',
    name: 'Emma Watson',
    email: 'emma.watson@company.com',
    department: 'product',
    position: 'Product Manager',
    avatar: 'EW'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    department: 'marketing',
    position: 'Marketing Director',
    avatar: 'SC'
  },
  {
    id: '4',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    department: 'sales',
    position: 'Sales Manager',
    avatar: 'RT'
  },
  {
    id: '5',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'engineering',
    position: 'Senior Developer',
    avatar: 'JD'
  }
];

// Mock OKRs data per user
const mockUserOKRs: Record<string, any[]> = {
  '1': [
    {
      id: 'okr-alex-1',
      objective: 'Lead engineering team to deliver high-quality products',
      keyResults: [
        {
          id: 'kr1',
          title: 'Reduce deployment time by 50%',
          progress: 85,
          target: '50%',
          current: '42%',
          status: 'on-track' as const
        },
        {
          id: 'kr2',
          title: 'Achieve 99.9% system uptime',
          progress: 95,
          target: '99.9%',
          current: '99.8%',
          status: 'on-track' as const
        },
        {
          id: 'kr3',
          title: 'Implement 15 new features',
          progress: 70,
          target: '15',
          current: '10',
          status: 'at-risk' as const
        }
      ],
      owner: 'Alex Rodriguez',
      team: 'Engineering',
      deadline: '2024-03-31',
      progress: 83,
      type: 'committed' as const
    }
  ],
  '2': [
    {
      id: 'okr-emma-1',
      objective: 'Drive product innovation and user satisfaction',
      keyResults: [
        {
          id: 'kr1',
          title: 'Launch 3 major product features',
          progress: 60,
          target: '3',
          current: '2',
          status: 'at-risk' as const
        },
        {
          id: 'kr2',
          title: 'Increase user satisfaction score to 4.5/5',
          progress: 80,
          target: '4.5',
          current: '4.2',
          status: 'on-track' as const
        }
      ],
      owner: 'Emma Watson',
      team: 'Product',
      deadline: '2024-03-31',
      progress: 70,
      type: 'committed' as const
    }
  ],
  '3': [
    {
      id: 'okr-sarah-1',
      objective: 'Expand brand awareness and market reach',
      keyResults: [
        {
          id: 'kr1',
          title: 'Increase website traffic by 40%',
          progress: 75,
          target: '40%',
          current: '30%',
          status: 'on-track' as const
        },
        {
          id: 'kr2',
          title: 'Generate 500 qualified leads',
          progress: 90,
          target: '500',
          current: '450',
          status: 'on-track' as const
        }
      ],
      owner: 'Sarah Chen',
      team: 'Marketing',
      deadline: '2024-03-31',
      progress: 82,
      type: 'committed' as const
    }
  ],
  '4': [
    {
      id: 'okr-robert-1',
      objective: 'Exceed sales targets and expand customer base',
      keyResults: [
        {
          id: 'kr1',
          title: 'Achieve $2M in quarterly revenue',
          progress: 45,
          target: '$2M',
          current: '$900K',
          status: 'at-risk' as const
        },
        {
          id: 'kr2',
          title: 'Acquire 50 new enterprise clients',
          progress: 60,
          target: '50',
          current: '30',
          status: 'on-track' as const
        }
      ],
      owner: 'Robert Taylor',
      team: 'Sales',
      deadline: '2024-03-31',
      progress: 52,
      type: 'committed' as const
    }
  ],
  '5': [
    {
      id: 'okr-john-1',
      objective: 'Improve personal productivity and deliver high-quality code',
      keyResults: [
        {
          id: 'kr1',
          title: 'Complete 15 feature tickets per sprint',
          progress: 80,
          target: '15',
          current: '12',
          status: 'on-track' as const
        },
        {
          id: 'kr2',
          title: 'Maintain code review response time under 2 hours',
          progress: 90,
          target: '< 2 hours',
          current: '1.5 hours',
          status: 'on-track' as const
        },
        {
          id: 'kr3',
          title: 'Achieve 95% unit test coverage',
          progress: 65,
          target: '95%',
          current: '78%',
          status: 'at-risk' as const
        }
      ],
      owner: 'John Doe',
      team: 'Engineering',
      deadline: '2024-03-31',
      progress: 78,
      type: 'committed' as const
    }
  ]
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (in real app, verify password hash)
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'password123') { // Simple password check for demo
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const getUserOKRs = () => {
    if (!user) return [];
    return mockUserOKRs[user.id] || [];
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
      getUserOKRs
    }}>
      {children}
    </AuthContext.Provider>
  );
};
