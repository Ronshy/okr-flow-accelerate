import React, { useState } from 'react';
import BasicProgressBar from '@/components/OKR/BasicProgressBar';

const ProgressBarDemo = () => {
  const [demoKeyResults, setDemoKeyResults] = useState([
    {
      id: 'demo1',
      title: 'Launch 5 new AI features',
      current: '2',
      target: '5',
      progress: 40,
      status: 'at-risk' as const
    },
    {
      id: 'demo2',
      title: 'Achieve 95% customer satisfaction',
      current: '88%',
      target: '95%',
      progress: 93,
      status: 'on-track' as const
    },
    {
      id: 'demo3',
      title: 'Reduce operational costs by 20%',
      current: '5%',
      target: '20%',
      progress: 25,
      status: 'off-track' as const
    }
  ]);

  const handleProgressUpdate = (keyResultId: string, newProgress: number, newStatus: string, newCurrent: string) => {
    setDemoKeyResults(prev => 
      prev.map(kr => 
        kr.id === keyResultId 
          ? { ...kr, progress: newProgress, status: newStatus as any, current: newCurrent }
          : kr
      )
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Interactive Progress Bar Demo</h1>
        <p className="text-gray-600 text-lg">
          Click on any progress bar to edit progress and see status changes in real-time
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Use:</h2>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Click on any progress bar to enter edit mode</li>
          <li>• Update the current value to see progress and status change</li>
          <li>• Status automatically updates based on progress percentage</li>
          <li>• Progress bar color changes based on status (Green: On-track, Yellow: At-risk, Red: Off-track)</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {demoKeyResults.map((kr) => (
          <div key={kr.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Result Demo</h3>
            <BasicProgressBar
              keyResultId={kr.id}
              title={kr.title}
              current={kr.current}
              target={kr.target}
              progress={kr.progress}
              status={kr.status}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Rules:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">On-track: ≥70% progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">At-risk: 40-69% progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Off-track: &lt;40% progress</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Features:</h3>
        <ul className="text-green-800 space-y-1 text-sm">
          <li>✅ Real-time progress calculation</li>
          <li>✅ Automatic status updates</li>
          <li>✅ Visual progress indicators</li>
          <li>✅ Hover effects and animations</li>
          <li>✅ Simple and clean design</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressBarDemo;
