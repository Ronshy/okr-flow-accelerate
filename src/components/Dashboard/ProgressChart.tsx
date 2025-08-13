
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuarterlyData {
  quarter: string;
  completed: number;
  total: number;
}

interface OKRStatusData {
  name: string;
  value: number;
  color: string;
}

const ProgressChart = () => {
  const { user } = useAuth();
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);
  const [okrStatusData, setOkrStatusData] = useState<OKRStatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChartData();
    }
  }, [user]);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);

      // Fetch OKRs with their key results
      const { data: okrs, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*)
        `);

      if (error) {
        console.error('Error fetching OKRs for charts:', error);
        return;
      }

      if (okrs) {
        // Generate quarterly data for current year
        const currentYear = new Date().getFullYear();
        const quarterlyDataArray: QuarterlyData[] = [];
        
        for (let quarter = 1; quarter <= 4; quarter++) {
          const startMonth = (quarter - 1) * 3;
          const endMonth = startMonth + 2;
          
          const quarterOKRs = okrs.filter(okr => {
            const okrDate = new Date(okr.created_at);
            const okrMonth = okrDate.getMonth();
            return okrDate.getFullYear() === currentYear && okrMonth >= startMonth && okrMonth <= endMonth;
          });

          const completed = quarterOKRs.filter(okr => okr.progress === 100).length;
          const total = quarterOKRs.length;

          quarterlyDataArray.push({
            quarter: `Q${quarter} ${currentYear}`,
            completed,
            total: Math.max(total, 1) // Avoid division by zero
          });
        }

        setQuarterlyData(quarterlyDataArray);

        // Calculate OKR status distribution
        const statusCounts: { [key: string]: number } = {};
        
        okrs.forEach(okr => {
          if (okr.key_results && okr.key_results.length > 0) {
            okr.key_results.forEach((kr: any) => {
              const status = kr.status || 'on-track';
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
          }
        });

        const statusColors = {
          'on-track': '#10B981',
          'at-risk': '#F59E0B',
          'off-track': '#EF4444'
        };

        const statusData: OKRStatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
          value: count,
          color: statusColors[status as keyof typeof statusColors] || '#6B7280'
        }));

        setOkrStatusData(statusData);
      }
    } catch (error) {
      console.error('Error in fetchChartData:', error);
    } finally {
      setIsLoading(false);
    }
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly OKR Progress</h3>
        {quarterlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `${value} OKRs`,
                  name === 'completed' ? 'Completed' : 'Total'
                ]}
                labelFormatter={(label) => `Quarter: ${label}`}
              />
              <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No quarterly data available
          </div>
        )}
      </div>

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
                <Tooltip 
                  formatter={(value: any) => [`${value} key results`, 'Count']}
                />
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
            No OKR status data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
