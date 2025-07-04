
import React, { useState } from 'react';
import { Target, Plus, Filter, Grid, List, Search } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';

const OKRManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterLevel, setFilterLevel] = useState<'all' | 'company' | 'team' | 'individual'>('all');

  const okrData = [
    {
      id: '1',
      objective: 'Accelerate product development velocity and quality',
      keyResults: [
        {
          id: 'kr1',
          title: 'Reduce average feature delivery time by 40%',
          progress: 75,
          target: '40%',
          current: '30%',
          status: 'on-track' as const
        },
        {
          id: 'kr2',
          title: 'Achieve 99.5% uptime across all services',
          progress: 92,
          target: '99.5%',
          current: '99.2%',
          status: 'on-track' as const
        },
        {
          id: 'kr3',
          title: 'Implement automated testing for 90% of codebase',
          progress: 60,
          target: '90%',
          current: '54%',
          status: 'at-risk' as const
        }
      ],
      owner: 'Alex Rodriguez',
      team: 'Engineering',
      deadline: '2024-03-31',
      progress: 76,
      type: 'committed' as const
    },
    {
      id: '2',
      objective: 'Transform customer onboarding experience',
      keyResults: [
        {
          id: 'kr4',
          title: 'Reduce time-to-value from 7 days to 2 days',
          progress: 85,
          target: '2 days',
          current: '3 days',
          status: 'on-track' as const
        },
        {
          id: 'kr5',
          title: 'Achieve 95% completion rate for onboarding flow',
          progress: 70,
          target: '95%',
          current: '88%',
          status: 'at-risk' as const
        }
      ],
      owner: 'Emma Watson',
      team: 'Customer Success',
      deadline: '2024-02-29',
      progress: 78,
      type: 'committed' as const
    },
    {
      id: '3',
      objective: 'Establish market leadership in AI-powered analytics',
      keyResults: [
        {
          id: 'kr6',
          title: 'Launch 5 new AI features',
          progress: 40,
          target: '5',
          current: '2',
          status: 'at-risk' as const
        },
        {
          id: 'kr7',
          title: 'Achieve recognition as top 3 AI vendor',
          progress: 20,
          target: 'Top 3',
          current: 'Top 10',
          status: 'off-track' as const
        }
      ],
      owner: 'David Kim',
      team: 'Product Strategy',
      deadline: '2024-06-30',
      progress: 30,
      type: 'aspirational' as const
    }
  ];

  const filteredOKRs = okrData.filter(okr => {
    if (filterLevel === 'all') return true;
    // This would be based on actual data structure in real app
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OKR Management</h1>
          <p className="text-gray-600 mt-1">Track and manage objectives and key results</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create OKR</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search OKRs..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="company">Company</option>
            <option value="team">Team</option>
            <option value="individual">Individual</option>
          </select>

          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOKRs.map((okr) => (
          <OKRCard key={okr.id} {...okr} />
        ))}
      </div>

      {filteredOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No OKRs found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first OKR</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Your First OKR
          </button>
        </div>
      )}
    </div>
  );
};

export default OKRManagement;
