
import React, { useState } from 'react';
import { Target, Plus, Filter, Search, Users } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';

const TeamOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('engineering');

  const teamOKRs = [
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
        }
      ],
      owner: 'Engineering Team',
      team: 'Engineering',
      deadline: '2024-03-31',
      progress: 84,
      type: 'committed' as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team OKRs</h1>
          <p className="text-gray-600 mt-1">Manage and track team objectives across departments</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team OKR</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team OKRs..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={selectedTeam} 
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Teams</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>

          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Team Level</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teamOKRs.map((okr) => (
          <OKRCard key={okr.id} {...okr} />
        ))}
      </div>

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        level="team"
      />
    </div>
  );
};

export default TeamOKR;
