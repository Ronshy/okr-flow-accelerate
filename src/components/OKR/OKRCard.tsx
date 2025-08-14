
import React from 'react';
import { Target, Users, Calendar, TrendingUp } from 'lucide-react';
import BasicProgressBar from './BasicProgressBar';

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: string;
  current: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

interface OKRCardProps {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  owner: string;
  team: string;
  deadline: string;
  progress: number;
  type: 'aspirational' | 'committed';
  onKeyResultUpdate?: (keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => void;
}

const OKRCard = ({ objective, keyResults, owner, team, deadline, progress, type, onKeyResultUpdate }: OKRCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'off-track': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleKeyResultUpdate = (keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => {
    if (onKeyResultUpdate) {
      onKeyResultUpdate(keyResultId, newProgress, newStatus, newCurrent);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              type === 'aspirational' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {type === 'aspirational' ? 'Aspirational' : 'Committed'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{objective}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{owner}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{deadline}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{progress}%</span>
          </div>
          <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-full rounded-full ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Key Results</h4>
        {keyResults.map((kr) => (
          <BasicProgressBar
            key={kr.id}
            keyResultId={kr.id}
            title={kr.title}
            current={kr.current}
            target={kr.target}
            progress={kr.progress}
            status={kr.status}
            onProgressUpdate={(keyResultId, newProgress, newStatus, newCurrent) => 
              handleKeyResultUpdate(keyResultId, newProgress, newStatus, newCurrent)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default OKRCard;
