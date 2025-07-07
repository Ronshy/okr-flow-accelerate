
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

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
