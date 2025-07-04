
import React, { useState } from 'react';
import { Star, Heart, Award, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Engagement = () => {
  const [activeTab, setActiveTab] = useState<'recognition' | 'survey' | 'analytics'>('recognition');

  const recognitionData = [
    {
      from: 'Sarah Johnson',
      to: 'Mike Chen',
      type: 'Outstanding Work',
      message: 'Amazing job on the mobile app redesign! The user feedback has been incredible.',
      date: '2024-01-12',
      icon: '🏆'
    },
    {
      from: 'Alex Rodriguez',
      to: 'Emma Watson',
      type: 'Team Collaboration',
      message: 'Thank you for always being so helpful and collaborative. You make our team stronger!',
      date: '2024-01-11',
      icon: '🤝'
    },
    {
      from: 'David Kim',
      to: 'Lisa Chen',
      type: 'Innovation',
      message: 'Your creative solution to the API performance issue was brilliant!',
      date: '2024-01-10',
      icon: '💡'
    }
  ];

  const surveyResults = [
    { metric: 'Overall Satisfaction', score: 4.2, trend: '+0.3' },
    { metric: 'Work-Life Balance', score: 3.8, trend: '+0.1' },
    { metric: 'Career Growth', score: 4.0, trend: '+0.5' },
    { metric: 'Team Collaboration', score: 4.5, trend: '+0.2' },
    { metric: 'Leadership', score: 3.9, trend: '-0.1' }
  ];

  const engagementTrends = [
    { month: 'Oct', score: 78 },
    { month: 'Nov', score: 82 },
    { month: 'Dec', score: 85 },
    { month: 'Jan', score: 88 }
  ];

  const sentimentData = [
    { name: 'Very Positive', value: 45, color: '#10B981' },
    { name: 'Positive', value: 35, color: '#3B82F6' },
    { name: 'Neutral', value: 15, color: '#F59E0B' },
    { name: 'Negative', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-gray-600 mt-1">Foster recognition and measure team satisfaction</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Give Recognition
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send Survey
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'recognition', label: 'Recognition', icon: Award },
              { id: 'survey', label: 'Pulse Surveys', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'recognition' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">This Month</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Top Performer</span>
                  </div>
                  <p className="text-sm font-bold text-yellow-600">Sarah J.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Most Recognized</span>
                  </div>
                  <p className="text-sm font-bold text-green-600">Mike C.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Participation</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">89%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Recognition</h3>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                
                {recognitionData.map((recognition, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{recognition.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{recognition.from}</span>
                            <span className="text-gray-500 mx-2">recognized</span>
                            <span className="font-medium text-gray-900">{recognition.to}</span>
                          </div>
                          <span className="text-sm text-gray-500">{recognition.date}</span>
                        </div>
                        <div className="mb-2">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                            {recognition.type}
                          </span>
                        </div>
                        <p className="text-gray-700">{recognition.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recognition Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Outstanding Work', icon: '🏆' },
                    { name: 'Team Player', icon: '🤝' },
                    { name: 'Innovation', icon: '💡' },
                    { name: 'Going Extra Mile', icon: '🚀' },
                    { name: 'Problem Solver', icon: '🔧' },
                    { name: 'Mentor', icon: '👨‍🏫' },
                    { name: 'Customer Focus', icon: '❤️' },
                    { name: 'Leadership', icon: '⭐' }
                  ].map((category) => (
                    <button key={category.name} className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors text-center">
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-sm font-medium">{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Survey Results</h3>
                  {surveyResults.map((result, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{result.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">{result.score}</span>
                          <span className={`text-sm font-medium ${
                            result.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.trend}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(result.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Pulse</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">This Week's Question</h4>
                    <p className="text-blue-800 mb-4">"How satisfied are you with your current workload?"</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Very Satisfied</span>
                        <span>32%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfied</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>18%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dissatisfied</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Response Rate</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-green-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-green-800 font-bold">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Engagement Score</h4>
                  <p className="text-3xl font-bold text-blue-600">88%</p>
                  <p className="text-sm text-blue-700">+5% from last quarter</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Active Participants</h4>
                  <p className="text-3xl font-bold text-green-600">124</p>
                  <p className="text-sm text-green-700">89% of workforce</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Recognition Rate</h4>
                  <p className="text-3xl font-bold text-purple-600">3.2</p>
                  <p className="text-sm text-purple-700">per employee/month</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Engagement;
