
import React from 'react';
import { Target, Users, CheckSquare, TrendingUp, Star, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MetricCard from '@/components/Dashboard/MetricCard';
import ProgressChart from '@/components/Dashboard/ProgressChart';
import OKRPieChart from '@/components/Dashboard/OKRPieChart';
import OKRComparisonChart from '@/components/Dashboard/OKRComparisonChart';
import OKRCard from '@/components/OKR/OKRCard';
import SampleDataManager from '@/components/Dashboard/SampleDataManager';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { user } = useAuth();
  const { metrics, recentOKRs, upcomingDeadlines, isLoading, error, refetch } = useDashboardData();

  const metricCards = [
    {
      title: 'Active OKRs',
      value: metrics.activeOKRs.toString(),
      change: `${metrics.activeOKRs > 0 ? '+' : ''}${metrics.activeOKRs} active objectives`,
      changeType: metrics.activeOKRs > 0 ? 'positive' as const : 'neutral' as const,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Team Performance',
      value: `${metrics.teamPerformance}%`,
      change: `${metrics.teamPerformance > 80 ? '+' : ''}${metrics.teamPerformance}% average progress`,
      changeType: metrics.teamPerformance > 80 ? 'positive' as const : metrics.teamPerformance > 60 ? 'neutral' as const : 'negative' as const,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Tasks Completed',
      value: metrics.tasksCompleted.toString(),
      change: `${metrics.tasksCompleted} key results completed`,
      changeType: 'positive' as const,
      icon: CheckSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Engagement Score',
      value: `${metrics.engagementScore}%`,
      change: `${metrics.engagementScore > 80 ? '+' : ''}${metrics.engagementScore}% team engagement`,
      changeType: metrics.engagementScore > 80 ? 'positive' as const : metrics.engagementScore > 60 ? 'neutral' as const : 'negative' as const,
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}! Here's your performance overview.
          </p>
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

      <SampleDataManager />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
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
        {recentOKRs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentOKRs.map((okr) => (
              <OKRCard key={okr.id} {...okr} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No OKRs found. Create your first OKR to get started!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {upcomingDeadlines.map((item, index) => (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming deadlines. Great job staying on track!</p>
            </div>
          )}
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
