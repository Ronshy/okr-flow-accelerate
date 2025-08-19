import React, { useState } from 'react';
import { Edit3, Check, X, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SimpleProgressBarProps {
  keyResultId: string;
  title: string;
  current: string;
  target: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'off-track';
  onProgressUpdate: (keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => void;
}

const SimpleProgressBar = ({ 
  keyResultId, 
  title, 
  current, 
  target, 
  progress, 
  status, 
  onProgressUpdate 
}: SimpleProgressBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCurrent, setEditCurrent] = useState(current);
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateStatus = (progressValue: number): 'on-track' | 'at-risk' | 'off-track' => {
    if (progressValue >= 70) return 'on-track';
    if (progressValue >= 40) return 'at-risk';
    return 'off-track';
  };

  const calculateProgress = (currentValue: string, targetValue: string): number => {
    if (targetValue.includes('%')) {
      const targetNum = parseFloat(targetValue.replace('%', ''));
      const currentNum = parseFloat(currentValue.replace('%', ''));
      return Math.min(Math.round((currentNum / targetNum) * 100), 100);
    }
    
    if (!isNaN(Number(currentValue)) && !isNaN(Number(targetValue))) {
      const targetNum = parseFloat(targetValue);
      const currentNum = parseFloat(currentValue);
      return Math.min(Math.round((currentNum / targetNum) * 100), 100);
    }
    
    return Math.min(Math.round((currentValue.length / targetValue.length) * 100), 100);
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off-track': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progressValue: number) => {
    if (progressValue >= 70) return 'bg-green-500';
    if (progressValue >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'on-track': return <TrendingUp className="w-4 h-4" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4" />;
      case 'off-track': return <AlertCircle className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const handleSave = () => {
    if (!editCurrent.trim()) return;

    const newProgress = calculateProgress(editCurrent, target);
    const newStatus = calculateStatus(newProgress);

    onProgressUpdate(keyResultId, newProgress, newStatus, editCurrent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCurrent(current);
    setIsEditing(false);
  };

  const handleProgressClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span>{status.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-medium">Progress: {progress}%</span>
        <span className="text-gray-500">{current} / {target}</span>
      </div>

      <div className="space-y-3">
        <div 
          className="relative cursor-pointer group"
          onClick={handleProgressClick}
          title="Click to edit progress"
        >
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ease-in-out ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div 
            className="absolute top-0 h-3 w-1 bg-white shadow-sm rounded-full transition-all duration-300 ease-in-out"
            style={{ left: `calc(${progress}% - 2px)` }}
          ></div>
          
          <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-full"></div>
        </div>

        {isEditing && (
          <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Update Progress</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Current Value
                </label>
                <Input
                  value={editCurrent}
                  onChange={(e) => setEditCurrent(e.target.value)}
                  placeholder={`Current progress (e.g., ${target})`}
                  className="text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Target: {target}</span>
                <span>New Progress: {calculateProgress(editCurrent, target)}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4" />
                  <span className="ml-1">Save</span>
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                  <span className="ml-1">Cancel</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="text-xs text-gray-500 text-center">
            <span className="font-medium">Preview:</span> New status will be{' '}
            <span className={`font-medium ${getStatusColor(calculateStatus(calculateProgress(editCurrent, target)))}`}>
              {calculateStatus(calculateProgress(editCurrent, target)).replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleProgressBar;
