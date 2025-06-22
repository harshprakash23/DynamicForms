import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  Sparkles,
  Save,
  Loader2,
  Edit3,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await api.get(`/forms/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setLoading(false);
      } catch (err) {
        setMessage(err.response?.data?.error || 'An error occurred while fetching the form');
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchForm();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.put(`/forms/${id}`, { title, description });
      setMessage(response.data.message);
      setTimeout(() => navigate('/forms'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred while updating the form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-8 lg:p-12 text-center">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 text-white animate-spin" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Loading Form</h3>
          <p className="text-gray-600">Please wait while we fetch your form details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  onClick={() => navigate('/forms')}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </button>
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl shadow-lg">
                  <Edit3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Edit Form
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Update your form details</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Form ID: {id}</span>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Form Edit Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              Form Details
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm lg:text-base">
                  Form Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="Enter a compelling title for your form"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm lg:text-base">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base resize-none"
                  rows="4"
                  placeholder="Describe what this form is about"
                  required
                />
              </div>
            </div>

            {/* Form Preview Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Current Form Preview
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-gray-800 font-semibold mt-1">{title || 'No title set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-700 mt-1">{description || 'No description set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit"
                disabled={submitting || !title.trim() || !description.trim()}
                className={`flex-1 py-4 lg:py-5 text-lg lg:text-xl font-bold rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 ${
                  submitting || !title.trim() || !description.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:scale-105'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Updating Form...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Update Form
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/forms')}
                className="sm:w-auto px-8 py-4 lg:py-5 text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:scale-105"
              >
                <ArrowLeft className="w-6 h-6" />
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-6 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-center font-semibold shadow-lg transform animate-pulse ${
            message.includes('successfully') || message.includes('updated') 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-200'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {message.includes('successfully') || message.includes('updated') ? (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Save className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
              )}
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditForm;