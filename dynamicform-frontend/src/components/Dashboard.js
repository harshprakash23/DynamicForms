import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  BarChart3, 
  Users, 
  Star,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';
import Sidebar from './Sidebar';
import api from '../services/api';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalForms: 12,
    totalResponses: 247,
    activeUsers: 18,
    completionRate: 87
  });
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get('/hello');
        setMessage(response.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setMessage(error.response?.data || 'An error occurred');
        }
      }
    };

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        setError('');
        const response = await api.get('/activities');
        
        let activitiesData = response.data;
        
        if (response.data.activities) {
          activitiesData = response.data.activities;
        }
        
        const uniqueActivities = activitiesData.filter((activity, index, self) =>
          index === self.findIndex((a) =>
            a.action === activity.action &&
            a.form === activity.form &&
            a.time === activity.time &&
            a.user_id === activity.user_id
          )
        );
        
        setActivities(uniqueActivities);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          // Handle error response as a list
          const errorMessage = error.response?.data?.[0]?.error || 'Failed to fetch activities';
          setError(errorMessage);
        }
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchData();
    fetchActivities();

    const intervalId = setInterval(fetchActivities, 30000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const quickActions = [
    {
      title: 'Create New Form',
      description: 'Build a custom form with drag & drop',
      icon: Plus,
      color: 'from-indigo-500 to-purple-600',
      action: () => navigate('/create-form')
    },
    {
      title: 'View My Forms',
      description: 'Manage and edit existing forms',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      action: () => navigate('/forms')
    },
    {
      title: 'Analytics',
      description: 'View detailed form statistics',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-600',
      action: () => console.log('Analytics')
    }
  ];

  const getActivityColor = (action) => {
    switch (action.toLowerCase()) {
      case 'form viewed':
        return 'bg-blue-500';
      case 'form created':
        return 'bg-green-500';
      case 'form updated':
        return 'bg-yellow-500';
      case 'form deleted':
        return 'bg-red-500';
      case 'form submitted':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 pt-20 p-4 sm:p-6 lg:p-8 bg-transparent ml-0 sm:ml-64">
        <div className="mb-6 lg:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl lg:rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Welcome Back!
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Ready to create amazing forms today?</p>
                </div>
              </div>
            </div>
            
            {(message || error) && (
              <div className={`mt-4 lg:mt-6 p-3 lg:p-4 rounded-xl lg:rounded-2xl border ${
                error ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
              }`}>
                <p className={`font-medium text-sm lg:text-base ${
                  error ? 'text-red-800' : 'text-indigo-800'
                }`}>
                  {error || message}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 lg:p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Forms</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.totalForms}</p>
                <div className="flex items-center gap-1 mt-1 lg:mt-2">
                  <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                  <span className="text-xs lg:text-sm text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 lg:p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide">Responses</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.totalResponses}</p>
                <div className="flex items-center gap-1 mt-1 lg:mt-2">
                  <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                  <span className="text-xs lg:text-sm text-green-600 font-medium">+23% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 lg:p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.activeUsers}</p>
                <div className="flex items-center gap-1 mt-1 lg:mt-2">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                  <span className="text-xs lg:text-sm text-blue-600 font-medium">Last 24 hours</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 lg:p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide">Completion Rate</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.completionRate}%</p>
                <div className="flex items-center gap-1 mt-1 lg:mt-2">
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                  <span className="text-xs lg:text-sm text-yellow-600 font-medium">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              onClick={action.action}
              className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${action.color} rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">{action.description}</p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all duration-300 text-sm lg:text-base">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl border border-white/50 p-6 lg:p-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
            Recent Activity
          </h2>
          
          <div className="space-y-3 lg:space-y-4">
            {loadingActivities ? (
              <p className="text-gray-600 text-sm lg:text-base">Loading activities...</p>
            ) : error ? (
              <p className="text-red-600 text-sm lg:text-base">{error}</p>
            ) : activities.length === 0 ? (
              <p className="text-gray-600 text-sm lg:text-base">No recent activities.</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 rounded-xl lg:rounded-2xl hover:bg-gray-50/50 transition-colors duration-200 border border-gray-100/50">
                  <div className={`w-3 h-3 lg:w-4 lg:h-4 ${activity.color || getActivityColor(activity.action)} rounded-full flex-shrink-0`}></div>
                  
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">{activity.action}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-gray-600 text-sm lg:text-base truncate">{activity.form}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                      <span className="font-medium text-indigo-600">
                        {activity.user_name || 'Unknown User'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end flex-shrink-0">
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">{activity.time}</p>
                    {activity.user_id && (
                      <p className="text-xs text-gray-400 mt-1">User #{activity.user_id}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;