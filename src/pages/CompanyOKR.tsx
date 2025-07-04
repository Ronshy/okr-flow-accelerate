
import React, { useState } from 'react';
import { Target, Plus, Filter, Search, Building } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';

const CompanyOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const companyOKRs = [
    {
      id: '1',
      objective: 'Establish market leadership in AI-powered analytics',
      keyResults: [
        {
          id: 'kr1',
          title: 'Launch 5 new AI features',
          progress: 40,
          target: '5',
          current: '2',
          status: 'at-risk' as const
        },
        {
          id: 'kr2',
          title: 'Achieve recognition as top 3 AI vendor',
          progress: 20,
          target: 'Top 3',
          current: 'Top 10',
          status: 'off-track' as const
        },
        {
          id: 'kr3',
          title: 'Increase market share by 25%',
          progress: 60,
          target: '25%',
          current: '15%',
          status: 'on-track' as const
        }
      ],
      owner: 'Leadership Team',
      team: 'Company',
      deadline: '2024-12-31',
      progress: 40,
      type: 'aspirational' as const
    }
  ];

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
          <OKRCard key={okr.id} {...okr} />
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
