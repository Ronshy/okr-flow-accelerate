
import React, { useState } from 'react';
import { Target, Plus, Filter, Search, Calendar, User, Users } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';
import OKRAlignment from '@/components/OKR/OKRAlignment';
import { useDepartment } from '@/components/OKR/DepartmentContext';

const MyOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'on-track' | 'at-risk' | 'off-track'>('all');
  const [showAlignment, setShowAlignment] = useState(false);
  
  const { currentDepartment, getTeamOKRsByDepartment, departments } = useDepartment();
  const currentDeptName = departments.find(d => d.id === currentDepartment)?.name || 'Engineering';
  const teamOKRs = getTeamOKRsByDepartment(currentDepartment);

  const myOKRs = [
    {
      id: '1',
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
      owner: 'Me',
      team: currentDeptName,
      deadline: '2024-03-31',
      progress: 78,
      type: 'committed' as const
    }
  ];

  const filteredOKRs = myOKRs.filter(okr => {
    if (filterStatus === 'all') return true;
    return okr.keyResults.some(kr => kr.status === filterStatus);
  });

  const handleAlignment = (personalOKRId: string, teamOKRId: string) => {
    console.log('Aligning personal OKR', personalOKRId, 'with team OKR', teamOKRId);
    // Here you would implement the alignment logic
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My OKRs</h1>
          <p className="text-gray-600 mt-1">Track your personal objectives aligned with {currentDeptName} team goals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAlignment(!showAlignment)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>{showAlignment ? 'Hide' : 'Show'} Team Alignment</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Personal OKR</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search my OKRs..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="off-track">Off Track</option>
          </select>

          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Individual Level • {currentDeptName}</span>
        </div>
      </div>

      {showAlignment && myOKRs.length > 0 && teamOKRs.length > 0 && (
        <OKRAlignment 
          personalOKR={myOKRs[0]} 
          teamOKRs={teamOKRs}
          onAlign={handleAlignment}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredOKRs.map((okr) => (
          <OKRCard key={okr.id} {...okr} />
        ))}
      </div>

      {filteredOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Personal OKRs found</h3>
          <p className="text-gray-600 mb-4">Create your first personal OKR aligned with {currentDeptName} team goals</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First OKR
          </button>
        </div>
      )}

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        level="individual"
      />
    </div>
  );
};

export default MyOKR;
