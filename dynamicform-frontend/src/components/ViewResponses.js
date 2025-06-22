import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  Loader2,
  Grid,
  List,
  User
} from 'lucide-react';
import api from '../services/api';
import * as XLSX from 'xlsx';

const ViewResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form details
        const formResponse = await api.get(`/forms/${id}`);
        setForm(formResponse.data);

        // Fetch responses with user information
        const responsesResponse = await api.get(`/forms/${id}/responses`);
        console.log('Fetched responses:', responsesResponse.data); // Debug log
        setResponses(responsesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err); // Debug log
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data || 'An error occurred while fetching responses');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const filteredAndSortedResponses = responses
    .filter(response => {
      const searchLower = searchTerm.toLowerCase();
      return (
        response.content?.toLowerCase().includes(searchLower) ||
        (response.userName?.toLowerCase().includes(searchLower) || '')
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      } else {
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResponseStats = () => {
    if (responses.length === 0) return null;
    
    const today = new Date();
    const todayResponses = responses.filter(r => {
      const responseDate = new Date(r.submittedAt);
      return responseDate.toDateString() === today.toDateString();
    }).length;

    const thisWeek = responses.filter(r => {
      const responseDate = new Date(r.submittedAt);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return responseDate >= weekAgo;
    }).length;

    return { today: todayResponses, thisWeek };
  };

  const exportToExcel = () => {
    const data = filteredAndSortedResponses.map((response, index) => {
      let contentData = {};
      try {
        contentData = JSON.parse(response.content);
      } catch (e) {
        contentData = { Response: response.content };
      }

      return {
        'Response ID': response.id,
        'User ID': response.userId || 'N/A',
        'Username': response.userName || 'Anonymous',
        'Submitted At': formatDate(response.submittedAt),
        ...contentData
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    XLSX.writeFile(wb, `${form.title}_Responses_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const stats = getResponseStats();

  const renderResponseContent = (content) => {
    try {
      const parsedContent = JSON.parse(content);
      return (
        <div className="space-y-2">
          {Object.entries(parsedContent).map(([key, value], index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-gray-700">Q{index + 1}:</span>{' '}
              <span className="text-gray-600">
                {Array.isArray(value) ? value.join(', ') : value}
              </span>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return (
        <p className="text-gray-600 text-sm truncate">
          {content?.length > 100 ? `${content.substring(0, 100)}...` : content}
        </p>
      );
    }
  };

  const renderCardView = () => (
    <div className="space-y-4 lg:space-y-6">
      {filteredAndSortedResponses.map((response, index) => (
        <div key={response.id} className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 rounded-xl lg:rounded-2xl hover:bg-gray-50/50 transition-colors duration-200 border border-gray-100/50">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-900 text-sm lg:text-base">Response Submitted</p>
              <span className="text-gray-400">•</span>
              <div className="text-gray-600 text-sm lg:text-base">
                {renderResponseContent(response.content)}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
              <span className="font-medium text-indigo-600">
                {response.userName || 'Anonymous'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <p className="text-xs lg:text-sm text-gray-500 font-medium">{formatDate(response.submittedAt)}</p>
            {response.userId && (
              <p className="text-xs text-gray-400 mt-1">User #{response.userId}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white rounded-tl-xl">#</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white">User ID</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white">Username</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white">Response</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white rounded-tr-xl">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedResponses.map((response, index) => (
            <tr key={response.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
              <td className="py-4 px-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {response.userId || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {(response.userName || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 font-semibold">
                    {response.userName || 'Anonymous'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 max-w-xs">
                <div className="text-gray-600 text-sm">
                  {renderResponseContent(response.content)}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatDate(response.submittedAt)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Loading responses...</h3>
              <p className="text-gray-600">Please wait while we fetch the data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200 rounded-3xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700 mb-4">{error || 'Form not found'}</p>
          <button
            onClick={() => navigate('/forms')}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
          >
            Go Back to Forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  onClick={() => navigate('/forms')}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </button>
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl shadow-lg">
                  <Eye className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {form.title}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">{form.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button 
                  onClick={exportToExcel}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/50 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{responses.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/50 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.today}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/50 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/50 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {responses.length > 0 ? Math.round((responses.length / (responses.length + 10)) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              Responses ({filteredAndSortedResponses.length})
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'cards'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Cards
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search responses or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
          {filteredAndSortedResponses.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 lg:w-12 lg:h-12 text-gray-500" />
              </div>
              <p className="text-gray-500 text-lg lg:text-xl font-medium mb-2">
                {searchTerm ? 'No matching responses found' : 'No responses yet'}
              </p>
              <p className="text-gray-400 text-sm lg:text-base">
                {searchTerm ? 'Try adjusting your search terms' : 'Responses will appear here once people start submitting your form'}
              </p>
            </div>
          ) : (
            viewMode === 'table' ? renderTableView() : renderCardView()
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResponses;