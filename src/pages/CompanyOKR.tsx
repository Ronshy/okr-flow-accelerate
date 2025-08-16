
import React, { useState } from 'react';
import { Target, Plus, Filter, Search, Building } from 'lucide-react';
import OKRCard from '@/components/OKR/OKRCard';
import CreateOKRModal from '@/components/OKR/CreateOKRModal';
import { useOKR } from '@/contexts/OKRContext';

const CompanyOKR = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { okrs, isLoading, error, updateKeyResult, refetchOKRs } = useOKR();

  // Filter OKRs for company level
  const companyOKRs = okrs.filter(okr => okr.level === 'company');

  const handleKeyResultUpdate = async (okrId, keyResultId, newProgress, newStatus, newCurrent) => {
    await updateKeyResult(okrId, keyResultId, newProgress, newStatus, newCurrent);
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

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
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
              // TODO: implement search
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
            onKeyResultUpdate={(keyResultId, newProgress, newStatus, newCurrent) =>
              handleKeyResultUpdate(okr.id, keyResultId, newProgress, newStatus, newCurrent)
            }
          />
        ))}
      </div>

      {companyOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company OKRs found</h3>
          <p className="text-gray-600 mb-4">Create the first company OKR for your organization</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Company OKR
          </button>
        </div>
      )}

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          refetchOKRs();
        }}
        level="company"
      />
    </div>
  );
};

export default CompanyOKR;
