import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  X, 
  FileText, 
  Type, 
  AlignLeft, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  Hash, 
  Mail, 
  Calendar, 
  Star,
  Save,
  Sparkles,
  ArrowLeft,
  Settings,
  Eye
} from 'lucide-react';
import api from '../services/api';

const CreateForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const questionTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'textarea', label: 'Long Text', icon: AlignLeft },
    { value: 'radio', label: 'Multiple Choice (Single)', icon: Circle },
    { value: 'checkbox', label: 'Multiple Choice (Multiple)', icon: CheckCircle },
    { value: 'select', label: 'Dropdown', icon: ChevronDown },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'rating', label: 'Rating Scale', icon: Star }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      question: '',
      required: false,
      options: [''], // For radio, checkbox, select
      min: 1, // For rating
      max: 5  // For rating
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? 
        { ...q, options: q.options.filter((_, index) => index !== optionIndex) } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? 
        { ...q, options: q.options.map((opt, index) => index === optionIndex ? value : opt) } : q
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all questions have content
    const invalidQuestions = questions.filter(q => 
      !q.question.trim() || 
      (['radio', 'checkbox', 'select'].includes(q.type) && q.options.filter(opt => opt.trim()).length < 2)
    );

    if (invalidQuestions.length > 0) {
      setMessage('Please complete all questions and ensure choice questions have at least 2 options.');
      return;
    }

    try {
      const formData = { 
        title, 
        description, 
        questions: questions.map(q => ({
          ...q,
          options: q.options.filter(opt => opt.trim()) // Remove empty options
        }))
      };
      
      const response = await api.post('/forms', formData);
      setMessage(response.data.message);
      setTimeout(() => navigate('/forms'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while creating the form');
    }
  };

  const getQuestionIcon = (type) => {
    const questionType = questionTypes.find(t => t.value === type);
    return questionType ? questionType.icon : Type;
  };

  const renderQuestionOptions = (question) => {
    const needsOptions = ['radio', 'checkbox', 'select'].includes(question.type);
    const needsRange = question.type === 'rating';

    return (
      <div className="mt-4 space-y-4">
        {needsOptions && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Options
            </label>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(question.id, index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {question.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(question.id, index)}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(question.id)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>
        )}

        {needsRange && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Min Value
                </label>
                <input
                  type="number"
                  value={question.min}
                  onChange={(e) => updateQuestion(question.id, 'min', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Max Value
                </label>
                <input
                  type="number"
                  value={question.max}
                  onChange={(e) => updateQuestion(question.id, 'max', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  min="2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl lg:rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Create New Form
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Build your custom form with ease</p>
                </div>
              </div>
              <button
                onClick={() => console.log('Preview form')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Form Basic Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              Form Details
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm lg:text-base">Form Title</label>
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
                <label className="block text-gray-700 font-semibold mb-3 text-sm lg:text-base">Description</label>
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
          </div>

          {/* Questions Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            </div>

            {questions.length === 0 && (
              <div className="text-center py-12 lg:py-16">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 lg:w-12 lg:h-12 text-gray-500" />
                </div>
                <p className="text-gray-500 text-lg lg:text-xl font-medium mb-2">No questions added yet</p>
                <p className="text-gray-400 text-sm lg:text-base">Click "Add Question" to get started building your form</p>
              </div>
            )}

            <div className="space-y-6">
              {questions.map((question, index) => {
                const QuestionIcon = getQuestionIcon(question.type);
                return (
                  <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                          <QuestionIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-800 text-lg lg:text-xl">Question {index + 1}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="What would you like to ask?"
                          className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id={`required-${question.id}`}
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 bg-white border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <label htmlFor={`required-${question.id}`} className="ml-3 text-sm font-medium text-gray-700">
                        Required field
                      </label>
                    </div>

                    {renderQuestionOptions(question)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
            <button 
              type="submit"
              className={`w-full py-4 lg:py-5 text-lg lg:text-xl font-bold rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 ${
                questions.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:scale-105'
              }`}
              disabled={questions.length === 0}
            >
              <Save className="w-6 h-6" />
              {questions.length === 0 ? 'Add questions to create form' : 'Create Form'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-center font-semibold shadow-lg ${
            message.includes('successfully') || message.includes('created') 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateForm;