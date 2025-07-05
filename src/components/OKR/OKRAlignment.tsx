
import React from 'react';
import { Target, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface OKRAlignmentProps {
  personalOKR: any;
  teamOKRs: any[];
  onAlign: (personalOKRId: string, teamOKRId: string) => void;
}

const OKRAlignment = ({ personalOKR, teamOKRs, onAlign }: OKRAlignmentProps) => {
  const getAlignmentStatus = (personalOKR: any, teamOKR: any) => {
    // Simple alignment logic based on keywords and progress
    const personalKeywords = personalOKR.objective.toLowerCase().split(' ');
    const teamKeywords = teamOKR.objective.toLowerCase().split(' ');
    
    const commonWords = personalKeywords.filter(word => 
      teamKeywords.includes(word) && word.length > 3
    );
    
    if (commonWords.length >= 2) return 'aligned';
    if (commonWords.length === 1) return 'partial';
    return 'not-aligned';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">OKR Alignment</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Personal OKR</h4>
          <p className="text-sm text-blue-800">{personalOKR.objective}</p>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Team OKRs in Your Department</h4>
          {teamOKRs.map((teamOKR) => {
            const status = getAlignmentStatus(personalOKR, teamOKR);
            return (
              <div 
                key={teamOKR.id} 
                className={`p-4 rounded-lg border-2 ${
                  status === 'aligned' 
                    ? 'border-green-200 bg-green-50' 
                    : status === 'partial'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {teamOKR.objective}
                    </p>
                    <p className="text-xs text-gray-600">
                      Owner: {teamOKR.owner} • Progress: {teamOKR.progress}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {status === 'aligned' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : status === 'partial' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-xs font-medium ${
                      status === 'aligned' 
                        ? 'text-green-600' 
                        : status === 'partial'
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }`}>
                      {status === 'aligned' ? 'Aligned' : status === 'partial' ? 'Partial' : 'Not Aligned'}
                    </span>
                  </div>
                </div>
                
                {status !== 'aligned' && (
                  <button
                    onClick={() => onAlign(personalOKR.id, teamOKR.id)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Suggest alignment improvements
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OKRAlignment;
