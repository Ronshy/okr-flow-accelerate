import React, { useState } from 'react';
import { Database, Trash2, Plus } from 'lucide-react';
import { insertSampleData, clearSampleData } from '@/utils/sampleData';
import { Button } from '@/components/ui/button';

const SampleDataManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleInsertSampleData = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      await insertSampleData();
      setMessage({ text: 'Sample data inserted successfully!', type: 'success' });
      // Refresh the page to show new data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ text: 'Failed to insert sample data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSampleData = async () => {
    if (!confirm('Are you sure you want to clear all sample data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      await clearSampleData();
      setMessage({ text: 'Sample data cleared successfully!', type: 'success' });
      // Refresh the page to show empty state
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ text: 'Failed to clear sample data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Sample Data Manager</h4>
            <p className="text-xs text-blue-700">
              Insert or clear sample data for testing the dashboard
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleInsertSampleData}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Insert Sample Data
          </Button>
          <Button
            onClick={handleClearSampleData}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Data
          </Button>
        </div>
      </div>
      
      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SampleDataManager;
