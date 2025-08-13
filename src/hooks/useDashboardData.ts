import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  activeOKRs: number;
  teamPerformance: number;
  tasksCompleted: number;
  engagementScore: number;
}

export interface RecentOKR {
  id: string;
  objective: string;
  keyResults: Array<{
    id: string;
    title: string;
    progress: number;
    target: string;
    current: string;
    status: 'on-track' | 'at-risk' | 'off-track';
  }>;
  owner: string;
  team: string;
  deadline: string;
  progress: number;
  type: 'committed' | 'aspirational';
}

export interface UpcomingDeadline {
  task: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeOKRs: 0,
    teamPerformance: 0,
    tasksCompleted: 0,
    engagementScore: 0
  });
  const [recentOKRs, setRecentOKRs] = useState<RecentOKR[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all OKRs with their key results
      const { data: okrs, error: okrError } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          profiles!okrs_owner_id_fkey (name),
          departments!okrs_department_id_fkey (name)
        `);

      if (okrError) {
        console.error('Error fetching OKRs:', okrError);
        setError('Failed to fetch OKR data');
        return;
      }

      if (okrs) {
        // Calculate metrics
        const activeOKRs = okrs.filter(okr => 
          new Date(okr.deadline) > new Date() && okr.progress < 100
        ).length;

        // Calculate team performance based on average progress
        const totalProgress = okrs.reduce((sum, okr) => sum + (okr.progress || 0), 0);
        const teamPerformance = okrs.length > 0 ? Math.round(totalProgress / okrs.length) : 0;

        // Calculate tasks completed (key results with 100% progress)
        const tasksCompleted = okrs.reduce((total, okr) => {
          if (okr.key_results) {
            return total + okr.key_results.filter((kr: any) => kr.progress === 100).length;
          }
          return total;
        }, 0);

        // Calculate engagement score based on active OKRs and recent updates
        const engagementScore = Math.min(100, Math.round((activeOKRs / Math.max(okrs.length, 1)) * 100 + 20));

        setMetrics({
          activeOKRs,
          teamPerformance,
          tasksCompleted,
          engagementScore
        });

        // Process recent OKRs (last 5)
        const recentOKRsData = okrs
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(okr => ({
            id: okr.id,
            objective: okr.objective,
            keyResults: okr.key_results?.map((kr: any) => ({
              id: kr.id,
              title: kr.title,
              progress: kr.progress || 0,
              target: kr.target,
              current: kr.current || '0',
              status: kr.status as 'on-track' | 'at-risk' | 'off-track'
            })) || [],
            owner: okr.profiles?.name || 'Unknown',
            team: okr.departments?.name || 'Unknown',
            deadline: okr.deadline,
            progress: okr.progress || 0,
            type: okr.type as 'committed' | 'aspirational'
          }));

        setRecentOKRs(recentOKRsData);

        // Generate upcoming deadlines (OKRs due within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const upcomingDeadlinesData = okrs
          .filter(okr => {
            const deadline = new Date(okr.deadline);
            return deadline > new Date() && deadline <= thirtyDaysFromNow;
          })
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
          .slice(0, 5)
          .map(okr => {
            const daysUntilDeadline = Math.ceil((new Date(okr.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            let priority: 'high' | 'medium' | 'low' = 'low';
            
            if (daysUntilDeadline <= 7) priority = 'high';
            else if (daysUntilDeadline <= 14) priority = 'medium';

            return {
              task: okr.objective.length > 50 ? okr.objective.substring(0, 50) + '...' : okr.objective,
              due: okr.deadline,
              priority
            };
          });

        setUpcomingDeadlines(upcomingDeadlinesData);
      }
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return {
    metrics,
    recentOKRs,
    upcomingDeadlines,
    isLoading,
    error,
    refetch: fetchDashboardData
  };
};
