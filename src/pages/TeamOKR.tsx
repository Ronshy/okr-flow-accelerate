
import React, { useState } from 'react';
import { Target, Plus, Filter, Search, Users } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';
import { useDepartment } from '@/components/OKR/DepartmentContext';

const TeamOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { currentDepartment, setCurrentDepartment, departments, getTeamOKRsByDepartment } = useDepartment();
  const teamOKRs = getTeamOKRsByDepartment(currentDepartment);
  const currentDept = departments.find(d => d.id === currentDepartment);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team OKRs</h1>
          <p className="text-gray-600 mt-1">Manage and track team objectives for {currentDept?.name}</p>
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
            value={currentDepartment} 
            onChange={(e) => setCurrentDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team Level • {currentDept?.name}</span>
          </div>
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {currentDept?.members.length} members
          </div>
        </div>
      </div>

      {currentDept && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Department Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Department Head:</span>
              <p className="font-medium">{currentDept.head}</p>
            </div>
            <div>
              <span className="text-gray-500">Team Size:</span>
              <p className="font-medium">{currentDept.members.length} members</p>
            </div>
            <div>
              <span className="text-gray-500">Active OKRs:</span>
              <p className="font-medium">{teamOKRs.length} objectives</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {teamOKRs.map((okr) => (
          <OKRCard key={okr.id} {...okr} />
        ))}
      </div>

      {teamOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Team OKRs found</h3>
          <p className="text-gray-600 mb-4">Create the first team OKR for {currentDept?.name}</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Team OKR
          </button>
        </div>
      )}

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        level="team"
      />
    </div>
  );
};

export default TeamOKR;
