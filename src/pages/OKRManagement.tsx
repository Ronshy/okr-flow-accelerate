
import React, { useState } from 'react';
import { Target, Plus, Filter, Grid, List, Search } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';
import { useOKR } from '@/contexts/OKRContext';

const OKRManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterLevel, setFilterLevel] = useState<'all' | 'company' | 'team' | 'individual'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { okrs, isLoading, error, updateKeyResult, refetchOKRs } = useOKR();

  const filteredOKRs = okrs.filter(okr => {
    if (filterLevel === 'all') return true;
    return okr.level === filterLevel;
  });

  const handleKeyResultUpdate = async (okrId, keyResultId, newProgress, newStatus, newCurrent) => {
    await updateKeyResult(okrId, keyResultId, newProgress, newStatus, newCurrent);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OKR Management</h1>
          <p className="text-gray-600 mt-1">Track and manage objectives and key results</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
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
              // TODO: implement search
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
          <OKRCard 
            key={okr.id} 
            {...okr} 
            onKeyResultUpdate={(keyResultId, newProgress, newStatus, newCurrent) =>
              handleKeyResultUpdate(okr.id, keyResultId, newProgress, newStatus, newCurrent)
            }
          />
        ))}
      </div>

      {filteredOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No OKRs found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first OKR</p>
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
        onClose={() => {
          setIsCreateModalOpen(false);
          refetchOKRs();
        }}
        level={filterLevel === 'all' ? 'company' : filterLevel}
      />
    </div>
  );
};

export default OKRManagement;
