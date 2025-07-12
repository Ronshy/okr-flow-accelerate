
import React from 'react';
import { Target, Users, CheckSquare, TrendingUp, Star, Calendar } from 'lucide-react';
import MetricCard from '@/components/Dashboard/MetricCard';
import ProgressChart from '@/components/Dashboard/ProgressChart';
import OKRPieChart from '@/components/Dashboard/OKRPieChart';
import OKRComparisonChart from '@/components/Dashboard/OKRComparisonChart';
import OKRCard from '@/components/OKR/OKRCard';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Active OKRs',
      value: '24',
      change: '+12% from last quarter',
      changeType: 'positive' as const,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Team Performance',
      value: '87%',
      change: '+5% from last month',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Tasks Completed',
      value: '156',
      change: '+23% this week',
      changeType: 'positive' as const,
      icon: CheckSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Engagement Score',
      value: '92%',
      change: '+8% from last survey',
      changeType: 'positive' as const,
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  const recentOKRs = [
    {
      id: '1',
      objective: 'Increase customer satisfaction and retention rates',
      keyResults: [
        {
          id: 'kr1',
          title: 'Achieve NPS score of 70+',
          progress: 85,
          target: '70',
          current: '68',
          status: 'on-track' as const
        },
        {
          id: 'kr2',
          title: 'Reduce churn rate to below 5%',
          progress: 60,
          target: '5%',
          current: '6.2%',
          status: 'at-risk' as const
        },
        {
          id: 'kr3',
          title: 'Implement 3 new customer success features',
          progress: 100,
          target: '3',
          current: '3',
          status: 'on-track' as const
        }
      ],
      owner: 'Sarah Johnson',
      team: 'Customer Success',
      deadline: '2024-03-31',
      progress: 82,
      type: 'committed' as const
    },
    {
      id: '2',
      objective: 'Launch revolutionary mobile app experience',
      keyResults: [
        {
          id: 'kr4',
          title: 'Complete mobile app development',
          progress: 75,
          target: '100%',
          current: '75%',
          status: 'on-track' as const
        },
        {
          id: 'kr5',
          title: 'Achieve 10k+ app downloads in first month',
          progress: 0,
          target: '10k',
          current: '0',
          status: 'off-track' as const
        }
      ],
      owner: 'Mike Chen',
      team: 'Product Development',
      deadline: '2024-02-28',
      progress: 38,
      type: 'aspirational' as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your performance overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Q4 2024</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New OKR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <ProgressChart />
      
      <OKRPieChart />
      
      <OKRComparisonChart />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent OKRs</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All OKRs
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentOKRs.map((okr) => (
            <OKRCard key={okr.id} {...okr} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {[
              { task: 'Q4 Performance Reviews', due: '2024-01-15', priority: 'high' },
              { task: 'Mobile App Beta Testing', due: '2024-01-18', priority: 'medium' },
              { task: 'Customer Feedback Analysis', due: '2024-01-22', priority: 'low' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.task}</p>
                  <p className="text-sm text-gray-600">Due: {item.due}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              + Create New OKR
            </button>
            <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              + Add Task
            </button>
            <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              + Schedule 1-on-1
            </button>
            <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
              + Give Recognition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
