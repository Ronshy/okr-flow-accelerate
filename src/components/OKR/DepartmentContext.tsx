
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const departments: Department[] = [
    {
      id: 'engineering',
      name: 'Engineering',
      head: 'Alex Rodriguez',
      members: ['john.doe', 'jane.smith', 'alex.rodriguez']
    },
    {
      id: 'product',
      name: 'Product',
      head: 'Emma Watson',
      members: ['emma.watson', 'mike.johnson']
    },
    {
      id: 'marketing',
      name: 'Marketing',
      head: 'Sarah Chen',
      members: ['sarah.chen', 'david.kim']
    },
    {
      id: 'sales',
      name: 'Sales',
      head: 'Robert Taylor',
      members: ['robert.taylor', 'lisa.anderson']
    }
  ];

  const getUserDepartment = (userId: string): string => {
    const dept = departments.find(d => d.members.includes(userId));
    return dept?.id || 'engineering';
  };

  const getTeamOKRsByDepartment = (dept: string) => {
    // Sample team OKRs filtered by department
    const allTeamOKRs = [
      {
        id: '1',
        department: 'engineering',
        objective: 'Accelerate product development velocity and quality',
        keyResults: [
          {
            id: 'kr1',
            title: 'Reduce average feature delivery time by 40%',
            progress: 75,
            target: '40%',
            current: '30%',
            status: 'on-track' as const
          }
        ],
        owner: 'Engineering Team',
        team: 'Engineering',
        deadline: '2024-03-31',
        progress: 84,
        type: 'committed' as const
      }
    ];

    return allTeamOKRs.filter(okr => okr.department === dept);
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
