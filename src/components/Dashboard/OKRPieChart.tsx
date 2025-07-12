import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OKRData {
  name: string;
  value: number;
  color: string;
}

interface OKRLevelData {
  name: string;
  value: number;
  color: string;
}

const OKRPieChart = () => {
  const [okrStatusData, setOkrStatusData] = useState<OKRData[]>([]);
  const [okrLevelData, setOkrLevelData] = useState<OKRLevelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const statusColors = {
    'on-track': '#10B981',
    'at-risk': '#F59E0B', 
    'off-track': '#EF4444'
  };

  const levelColors = {
    'individual': '#3B82F6',
    'team': '#8B5CF6',
    'company': '#F59E0B'
  };

  useEffect(() => {
    if (user) {
      fetchOKRData();
    }
  }, [user]);

  const fetchOKRData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all OKRs with their key results
      const { data: okrs, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*)
        `);

      if (error) {
        console.error('Error fetching OKRs:', error);
        return;
      }

      if (okrs) {
        // Process status data
        const statusCounts: { [key: string]: number } = {};
        const levelCounts: { [key: string]: number } = {};

        okrs.forEach(okr => {
          // Count by level
          levelCounts[okr.level] = (levelCounts[okr.level] || 0) + 1;

          // Count by status (from key results)
          if (okr.key_results && okr.key_results.length > 0) {
            okr.key_results.forEach((kr: any) => {
              statusCounts[kr.status] = (statusCounts[kr.status] || 0) + 1;
            });
          }
        });

        // Format status data for pie chart
        const statusData: OKRData[] = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
          value: count,
          color: statusColors[status as keyof typeof statusColors] || '#6B7280'
        }));

        // Format level data for pie chart
        const levelData: OKRLevelData[] = Object.entries(levelCounts).map(([level, count]) => ({
          name: level.charAt(0).toUpperCase() + level.slice(1),
          value: count,
          color: levelColors[level as keyof typeof levelColors] || '#6B7280'
        }));

        setOkrStatusData(statusData);
        setOkrLevelData(levelData);
      }
    } catch (error) {
      console.error('Error in fetchOKRData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-gray-600">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OKR Status Distribution</h3>
        {okrStatusData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={okrStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {okrStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {okrStatusData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No OKR data available
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OKR Level Distribution</h3>
        {okrLevelData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={okrLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {okrLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {okrLevelData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No OKR data available
          </div>
        )}
      </div>
    </div>
  );
};

export default OKRPieChart; 