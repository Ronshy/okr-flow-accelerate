
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id: string;
  name: string;
  head: string;
  members: string[];
}

interface DepartmentContextType {
  currentDepartment: string;
  setCurrentDepartment: (dept: string) => void;
  departments: Department[];
  getUserDepartment: (userId: string) => string;
  getTeamOKRsByDepartment: (dept: string) => any[];
  alignPersonalOKRWithTeam: (personalOKR: any, teamOKR: any) => boolean;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within DepartmentProvider');
  }
  return context;
};

interface DepartmentProviderProps {
  children: ReactNode;
}

export const DepartmentProvider = ({ children }: DepartmentProviderProps) => {
  const [currentDepartment, setCurrentDepartment] = useState('engineering');
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');

      if (error) {
        console.error('Error fetching departments:', error);
        return;
      }

      if (data) {
        const formattedDepartments = data.map(dept => ({
          id: dept.name.toLowerCase(),
          name: dept.name,
          head: dept.head,
          members: [] // This could be populated by counting profiles
        }));
        setDepartments(formattedDepartments);
      }
    } catch (error) {
      console.error('Error in fetchDepartments:', error);
    }
  };

  // Sync with user's department on login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.department) {
        setCurrentDepartment(user.department.toLowerCase());
      }
    }
  }, []);

  const getUserDepartment = (userId: string): string => {
    // This would need to be implemented with actual user data
    return 'engineering';
  };

  const getTeamOKRsByDepartment = (dept: string) => {
    // This will be implemented later to fetch real team OKRs
    return [];
  };

  const alignPersonalOKRWithTeam = (personalOKR: any, teamOKR: any): boolean => {
    // Check if personal OKR aligns with team objectives
    const personalObjective = personalOKR.objective.toLowerCase();
    const teamObjective = teamOKR.objective.toLowerCase();
    
    // Simple alignment check based on keywords
    const commonKeywords = ['productivity', 'quality', 'delivery', 'performance'];
    return commonKeywords.some(keyword => 
      personalObjective.includes(keyword) && teamObjective.includes(keyword)
    );
  };

  return (
    <DepartmentContext.Provider value={{
      currentDepartment,
      setCurrentDepartment,
      departments,
      getUserDepartment,
      getTeamOKRsByDepartment,
      alignPersonalOKRWithTeam
    }}>
      {children}
    </DepartmentContext.Provider>
  );
};
