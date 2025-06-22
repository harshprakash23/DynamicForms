import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Share2, 
  BarChart3, 
  Edit3, 
  Trash2,
  Calendar,
  Users,
  Copy,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

const MyForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedLink, setCopiedLink] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name'
    const [responseCounts, setResponseCounts] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const fetchResponseCounts = async (formIds) => {
        try {
            const counts = {};
            // Fetch response counts for each form
            const countPromises = formIds.map(async (formId) => {
                try {
                    const response = await api.get(`/forms/${formId}/responses`);
                    const responses = Array.isArray(response.data) ? response.data : [];
                    counts[formId] = responses.length;
                } catch (err) {
                    console.error(`Error fetching responses for form ${formId}:`, err);
                    counts[formId] = 0; // Default to 0 if error
                }
            });
            
            await Promise.all(countPromises);
            setResponseCounts(counts);
        } catch (err) {
            console.error('Error fetching response counts:', err);
            // Set all counts to 0 if there's an error
            const defaultCounts = {};
            formIds.forEach(id => defaultCounts[id] = 0);
            setResponseCounts(defaultCounts);
        }
    };

    const fetchForms = async () => {
        try {
            console.log('Fetching forms from /api/forms...');
            const response = await api.get('/forms');
            console.log('API response:', response.data);
            const formsData = Array.isArray(response.data) ? response.data : [];
            console.log('Processed forms data:', formsData);
            setForms(formsData);
            
            // Fetch response counts for all forms
            if (formsData.length > 0) {
                const formIds = formsData.map(form => form.id);
                await fetchResponseCounts(formIds);
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching forms:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log('Unauthorized or forbidden access, redirecting to login...');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const errorMessage = err.response?.data?.error || 'An error occurred while fetching forms';
                console.error('Setting error message:', errorMessage);
                setError(errorMessage);
                setForms([]);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login...');
            navigate('/login');
            return;
        }

        fetchForms();
    }, [navigate, location.pathname]);

    const handleShare = (formId) => {
        const link = `${window.location.origin}/forms/${formId}/respond`;
        navigator.clipboard.writeText(link).then(() => {
            setCopiedLink(formId);
            setTimeout(() => setCopiedLink(''), 2000);
        });
    };

    const handleViewResponses = (formId) => {
        navigate(`/forms/${formId}/responses`);
    };

    const handleDelete = async (formId) => {
        if (window.confirm('Are you sure you want to delete this form? This will also delete all associated responses.')) {
            try {
                console.log(`Deleting form with ID: ${formId}`);
                await api.delete(`/forms/${formId}`);
                console.log(`Form ${formId} deleted successfully`);
                setForms(forms.filter((form) => form.id !== formId));
            } catch (err) {
                const deleteError = err.response?.data?.error || 'An error occurred while deleting the form';
                console.error('Error deleting form:', deleteError, err);
                setError(deleteError);
            }
        }
    };

    const handleEdit = (formId) => {
        navigate(`/forms/${formId}/edit`);
    };

    const filteredAndSortedForms = forms
        .filter(form => 
            form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-transparent">
                <div className="flex-1 pt-20 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-64">
                    <div className="flex items-center justify-center h-64">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4 text-center">Loading your forms...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        console.log('Rendering error state with message:', error);
        return (
            <div className="flex min-h-screen bg-transparent">
                <div className="flex-1 pt-20 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-64">
                    <div className="flex items-center justify-center h-64">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-red-600 font-semibold text-lg">{error}</p>
                            <button 
                                onClick={fetchForms}
                                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-transparent">
            <div className="flex-1 pt-20 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-64">
                {/* Header Section */}
                <div className="mb-6 lg:mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl shadow-lg">
                                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        My Forms
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                                        Manage and organize your forms
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/create-form')}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                                Create New Form
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                {forms.length > 0 && (
                    <div className="mb-6 lg:mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 lg:p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search forms..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="name">Alphabetical</option>
                                    </select>
                                    
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-300 ${
                                                viewMode === 'grid' 
                                                    ? 'bg-white shadow-md text-indigo-600' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-all duration-300 ${
                                                viewMode === 'list' 
                                                    ? 'bg-white shadow-md text-indigo-600' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forms Section */}
                {filteredAndSortedForms.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-8 lg:p-12 text-center">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                            {searchTerm ? 'No forms found' : "You haven't created any forms yet"}
                        </h3>
                        <p className="text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto">
                            {searchTerm 
                                ? `No forms match "${searchTerm}". Try a different search term.`
                                : 'Get started by creating your first form to collect responses and insights.'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => navigate('/create-form')}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Your First Form
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`grid gap-4 lg:gap-6 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                            : 'grid-cols-1'
                    }`}>
                        {filteredAndSortedForms.map((form) => (
                            <div 
                                key={form.id} 
                                className={`bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                                    viewMode === 'list' ? 'p-4 lg:p-6' : 'p-6 lg:p-8'
                                }`}
                            >
                                {viewMode === 'grid' ? (
                                    // Grid View
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
                                                <Users className="w-3 h-3 text-indigo-600" />
                                                <span className="text-xs font-medium text-indigo-600">
                                                    {responseCounts[form.id] || 0} responses
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4 lg:mb-6">
                                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                                {form.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm lg:text-base line-clamp-2 mb-3">
                                                {form.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                            <button
                                                onClick={() => handleShare(form.id)}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 lg:py-3 px-3 lg:px-4 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                            >
                                                {copiedLink === form.id ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                        Share
                                                    </>
                                                )}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleViewResponses(form.id)}
                                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 lg:py-3 px-3 lg:px-4 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                            >
                                                <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                Responses
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEdit(form.id)}
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2 lg:py-3 px-3 lg:px-4 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                            >
                                                <Edit3 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                Edit
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDelete(form.id)}
                                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 lg:py-3 px-3 lg:px-4 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                            >
                                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // List View
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-lg lg:text-xl font-bold text-gray-800 truncate">
                                                    {form.title}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg flex-shrink-0">
                                                    <Users className="w-3 h-3 text-indigo-600" />
                                                    <span className="text-xs font-medium text-indigo-600">
                                                        {Math.floor(Math.random() * 50) + 1}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm lg:text-base line-clamp-1 mb-2">
                                                {form.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleShare(form.id)}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                title="Share Form"
                                            >
                                                {copiedLink === form.id ? (
                                                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                                                ) : (
                                                    <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                                                )}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleViewResponses(form.id)}
                                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-2 lg:p-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                title="View Responses"
                                            >
                                                <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEdit(form.id)}
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white p-2 lg:p-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                title="Edit Form"
                                            >
                                                <Edit3 className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDelete(form.id)}
                                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 lg:p-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                title="Delete Form"
                                            >
                                                <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyForms;