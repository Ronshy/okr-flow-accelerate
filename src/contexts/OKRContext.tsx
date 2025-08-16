import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: string;
  current: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  owner: string;
  team: string;
  deadline: string;
  progress: number;
  type: 'committed' | 'aspirational';
  level: 'individual' | 'team' | 'company';
}

interface OKRContextType {
  okrs: OKR[];
  isLoading: boolean;
  error: string | null;
  refetchOKRs: () => void;
  updateKeyResult: (okrId: string, keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => Promise<void>;
}

const OKRContext = createContext<OKRContextType | undefined>(undefined);

export const useOKR = () => {
  const context = useContext(OKRContext);
  if (!context) {
    throw new Error('useOKR must be used within OKRProvider');
  }
  return context;
};

export const OKRProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOKRs = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data: okrsData, error: okrError } = await supabase
        .from('okrs')
        .select(`*, key_results (*), profiles!okrs_owner_id_fkey (name), departments!okrs_department_id_fkey (name)`);
      if (okrError) {
        setError('Failed to fetch OKR data');
        setIsLoading(false);
        return;
      }
      if (okrsData) {
        const formattedOKRs: OKR[] = okrsData.map((okr: any) => ({
          id: okr.id,
          objective: okr.objective,
          keyResults: (okr.key_results || []).map((kr: any) => ({
            id: kr.id,
            title: kr.title,
            progress: kr.progress || 0,
            target: kr.target,
            current: kr.current || '0',
            status: kr.status as 'on-track' | 'at-risk' | 'off-track',
          })),
          owner: okr.profiles?.name || 'Unknown',
          team: okr.departments?.name || 'Unknown',
          deadline: okr.deadline,
          progress: okr.progress || 0,
          type: okr.type as 'committed' | 'aspirational',
          level: okr.level as 'individual' | 'team' | 'company',
        }));
        setOKRs(formattedOKRs);
      }
    } catch (err) {
      setError('Failed to fetch OKR data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOKRs();
  }, [user]);

  // Auto refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) fetchOKRs();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const refetchOKRs = () => {
    fetchOKRs();
  };

  const updateKeyResult = async (okrId: string, keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => {
    // Update in Supabase
    await supabase
      .from('key_results')
      .update({ progress: newProgress, status: newStatus, current: newCurrent })
      .eq('id', keyResultId);
    // Update in local state
    setOKRs(prevOKRs =>
      prevOKRs.map(okr =>
        okr.id === okrId
          ? {
              ...okr,
              keyResults: okr.keyResults.map(kr =>
                kr.id === keyResultId
                  ? { ...kr, progress: newProgress, status: newStatus, current: newCurrent }
                  : kr
              ),
            }
          : okr
      )
    );
  };

  return (
    <OKRContext.Provider value={{ okrs, isLoading, error, refetchOKRs, updateKeyResult }}>
      {children}
    </OKRContext.Provider>
  );
};
