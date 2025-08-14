
import React, { useState, useEffect } from 'react';
import { Target, Plus, Filter, Search, Building } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CompanyOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [companyOKRs, setCompanyOKRs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCompanyOKRs();
    }
  }, [user]);

  const fetchCompanyOKRs = async () => {
    try {
      setIsLoading(true);
      const { data: okrs, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*)
        `)
        .eq('level', 'company');

      if (error) {
        console.error('Error fetching company OKRs:', error);
        return;
      }

      if (okrs) {
        const formattedOKRs = okrs.map(okr => ({
          id: okr.id,
          objective: okr.objective,
          keyResults: (okr.key_results || []).map((kr: any) => ({
            id: kr.id,
            title: kr.title,
            progress: kr.progress,
            target: kr.target,
            current: kr.current,
            status: kr.status
          })),
          owner: 'Leadership Team',
          team: 'Company',
          deadline: okr.deadline,
          progress: okr.progress,
          type: okr.type
        }));
        setCompanyOKRs(formattedOKRs);
      }
    } catch (error) {
      console.error('Error in fetchCompanyOKRs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyResultUpdate = async (keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => {
    try {
      // Update the local state immediately for better UX
      setCompanyOKRs(prevOKRs => 
        prevOKRs.map(okr => ({
          ...okr,
          keyResults: okr.keyResults.map(kr => 
            kr.id === keyResultId 
              ? { ...kr, progress: newProgress, status: newStatus, current: newCurrent }
              : kr
          )
        }))
      );

      // Recalculate overall OKR progress
      setCompanyOKRs(prevOKRs => 
        prevOKRs.map(okr => {
          const updatedKeyResults = okr.keyResults.map(kr => 
            kr.id === keyResultId 
              ? { ...kr, progress: newProgress, status: newStatus, current: newCurrent }
              : kr
          );
          
          // Calculate new overall progress
          const totalProgress = updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0);
          const averageProgress = updatedKeyResults.length > 0 ? Math.round(totalProgress / updatedKeyResults.length) : 0;
          
          return {
            ...okr,
            keyResults: updatedKeyResults,
            progress: averageProgress
          };
        })
      );

      // Update OKR progress in database
      const okrId = companyOKRs.find(okr => 
        okr.keyResults.some(kr => kr.id === keyResultId)
      )?.id;

      if (okrId) {
        const { error: okrUpdateError } = await supabase
          .from('okrs')
          .update({
            progress: Math.round(
              companyOKRs
                .find(okr => okr.id === okrId)
                ?.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / 
                companyOKRs.find(okr => okr.id === okrId)?.keyResults.length || 1
            ),
            updated_at: new Date().toISOString()
          })
          .eq('id', okrId);

        if (okrUpdateError) {
          console.error('Error updating OKR progress:', okrUpdateError);
        }
      }
    } catch (error) {
      console.error('Error updating key result:', error);
      // Revert local state on error
      fetchCompanyOKRs();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company OKRs</h1>
          <p className="text-gray-600 mt-1">Strategic objectives that drive organizational success</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Company OKR</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search company OKRs..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Building className="w-4 h-4" />
          <span>Company Level</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {companyOKRs.map((okr) => (
          <OKRCard 
            key={okr.id} 
            {...okr} 
            onKeyResultUpdate={handleKeyResultUpdate}
          />
        ))}
      </div>

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        level="company"
      />
    </div>
  );
};

export default CompanyOKR;
