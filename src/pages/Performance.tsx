
import React, { useState } from 'react';
import { Users, Calendar, Star, FileText, TrendingUp, MessageSquare } from 'lucide-react';

const Performance = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'one-on-one' | 'feedback'>('reviews');

  const performanceData = [
    {
      employee: 'John Doe',
      role: 'Senior Developer',
      team: 'Engineering',
      lastReview: '2024-01-10',
      nextReview: '2024-04-10',
      overallScore: 4.2,
      status: 'On Track'
    },
    {
      employee: 'Jane Smith',
      role: 'Product Manager',
      team: 'Product',
      lastReview: '2024-01-05',
      nextReview: '2024-04-05',
      overallScore: 4.7,
      status: 'Exceeds Expectations'
    },
    {
      employee: 'Mike Johnson',
      role: 'UX Designer',
      team: 'Design',
      lastReview: '2023-12-15',
      nextReview: '2024-03-15',
      overallScore: 3.8,
      status: 'Needs Improvement'
    }
  ];

  const upcomingOneOnOnes = [
    {
      employee: 'Sarah Wilson',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'Weekly Check-in',
      status: 'Scheduled'
    },
    {
      employee: 'Alex Brown',
      date: '2024-01-17',
      time: '10:00 AM',
      type: 'Career Development',
      status: 'Pending'
    }
  ];

  const recentFeedback = [
    {
      from: 'Emma Watson',
      to: 'David Kim',
      type: 'Peer Feedback',
      rating: 'Positive',
      date: '2024-01-12',
      comment: 'Excellent collaboration on the recent project. Great communication skills.'
    },
    {
      from: 'Manager',
      to: 'Lisa Chen',
      type: 'Manager Feedback',
      rating: 'Constructive',
      date: '2024-01-11',
      comment: 'Good progress on goals. Could improve time management for deliverables.'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Exceeds Expectations': return 'text-green-600 bg-green-100';
      case 'On Track': return 'text-blue-600 bg-blue-100';
      case 'Needs Improvement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600 mt-1">Track reviews, 1-on-1s, and feedback</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Schedule Review
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Give Feedback
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'reviews', label: 'Performance Reviews', icon: FileText },
              { id: 'one-on-one', label: '1-on-1 Meetings', icon: Calendar },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Avg Performance Score</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">4.2/5.0</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Reviews Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">28/32</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Due This Week</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">4</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role & Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.map((employee, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {employee.employee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{employee.employee}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.role}</div>
                          <div className="text-sm text-gray-500">{employee.team}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.lastReview}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.nextReview}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(employee.overallScore)}`}>
                            {employee.overallScore}/5.0
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'one-on-one' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming 1-on-1s</h3>
                  {upcomingOneOnOnes.map((meeting, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{meeting.employee}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          meeting.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {meeting.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{meeting.type}</p>
                      <p className="text-sm text-gray-500">{meeting.date} at {meeting.time}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Meeting Templates</h3>
                  <div className="space-y-2">
                    {[
                      'Weekly Check-in',
                      'Career Development',
                      'Goal Review',
                      'Feedback Session'
                    ].map((template) => (
                      <button key={template} className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Positive Feedback</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">156</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Feedback</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">203</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">360° Reviews</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
                {recentFeedback.map((feedback, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {feedback.from} → {feedback.to}
                        </span>
                        <span className="text-sm text-gray-500">({feedback.type})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feedback.rating === 'Positive' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {feedback.rating}
                        </span>
                        <span className="text-sm text-gray-500">{feedback.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
