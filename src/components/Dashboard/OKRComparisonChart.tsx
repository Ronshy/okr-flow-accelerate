import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OKRComparisonData {
  name: string;
  value: number;
  color: string;
}

interface OKRProgressData {
  level: string;
  averageProgress: number;
  totalOKRs: number;
}

const OKRComparisonChart = () => {
  const [myOKRData, setMyOKRData] = useState<OKRComparisonData[]>([]);
  const [companyOKRData, setCompanyOKRData] = useState<OKRComparisonData[]>([]);
  const [progressData, setProgressData] = useState<OKRProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const statusColors = {
    'on-track': '#10B981',
    'at-risk': '#F59E0B', 
    'off-track': '#EF4444'
  };

  useEffect(() => {
    if (user) {
      fetchOKRComparisonData();
    }
  }, [user]);

  const fetchOKRComparisonData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch individual OKRs (My OKR)
      const { data: individualOKRs, error: individualError } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*)
        `)
        .eq('level', 'individual');

      // Fetch company OKRs
      const { data: companyOKRs, error: companyError } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*)
        `)
        .eq('level', 'company');

      if (individualError || companyError) {
        console.error('Error fetching OKRs:', individualError || companyError);
        return;
      }

      // Process individual OKR data
      const individualStatusCounts: { [key: string]: number } = {};
      if (individualOKRs) {
        individualOKRs.forEach(okr => {
          if (okr.key_results && okr.key_results.length > 0) {
            okr.key_results.forEach((kr: any) => {
              individualStatusCounts[kr.status] = (individualStatusCounts[kr.status] || 0) + 1;
            });
          }
        });
      }

      // Process company OKR data
      const companyStatusCounts: { [key: string]: number } = {};
      if (companyOKRs) {
        companyOKRs.forEach(okr => {
          if (okr.key_results && okr.key_results.length > 0) {
            okr.key_results.forEach((kr: any) => {
              companyStatusCounts[kr.status] = (companyStatusCounts[kr.status] || 0) + 1;
            });
          }
        });
      }

      // Format individual OKR data
      const individualData: OKRComparisonData[] = Object.entries(individualStatusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: count,
        color: statusColors[status as keyof typeof statusColors] || '#6B7280'
      }));

      // Format company OKR data
      const companyData: OKRComparisonData[] = Object.entries(companyStatusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: count,
        color: statusColors[status as keyof typeof statusColors] || '#6B7280'
      }));

      // Calculate progress data
      const progressByLevel: { [key: string]: { total: number; count: number } } = {};
      
      if (individualOKRs) {
        individualOKRs.forEach(okr => {
          if (okr.progress !== null) {
            if (!progressByLevel['Individual']) {
              progressByLevel['Individual'] = { total: 0, count: 0 };
            }
            progressByLevel['Individual'].total += okr.progress;
            progressByLevel['Individual'].count += 1;
          }
        });
      }

      if (companyOKRs) {
        companyOKRs.forEach(okr => {
          if (okr.progress !== null) {
            if (!progressByLevel['Company']) {
              progressByLevel['Company'] = { total: 0, count: 0 };
            }
            progressByLevel['Company'].total += okr.progress;
            progressByLevel['Company'].count += 1;
          }
        });
      }

      const progressDataFormatted: OKRProgressData[] = Object.entries(progressByLevel).map(([level, data]) => ({
        level,
        averageProgress: data.count > 0 ? Math.round(data.total / data.count) : 0,
        totalOKRs: data.count
      }));

      setMyOKRData(individualData);
      setCompanyOKRData(companyData);
      setProgressData(progressDataFormatted);

    } catch (error) {
      console.error('Error in fetchOKRComparisonData:', error);
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My OKR Status Distribution</h3>
          {myOKRData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={myOKRData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {myOKRData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {myOKRData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No personal OKR data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company OKR Status Distribution</h3>
          {companyOKRData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={companyOKRData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {companyOKRData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {companyOKRData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No company OKR data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OKR Progress Comparison</h3>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageProgress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No progress data available
          </div>
        )}
      </div>
    </div>
  );
};

export default OKRComparisonChart; 