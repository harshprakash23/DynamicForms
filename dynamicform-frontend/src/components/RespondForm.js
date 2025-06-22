import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  Star,
  Calendar,
  Mail,
  Hash,
  Type,
  AlignLeft,
  Circle,
  CheckSquare,
  ChevronDown,
  Sparkles,
  Loader
} from 'lucide-react';
import api from '../services/api';

const RespondForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchFormAndLogView = async () => {
            try {
                // Log the form view
                const ipAddress = "127.0.0.1"; // Placeholder; in production, fetch dynamically (e.g., via ipify.org)
                const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
                await api.post(`/forms/${id}/view`, null, {
                    params: { 
                        ipAddress, 
                        userId: userId ? parseInt(userId) : null 
                    }
                });

                // Fetch the form data
                const response = await api.get(`/forms/${id}`);
                const formData = response.data;
                setForm(formData);
                
                // Initialize responses object with default values
                const initialResponses = {};
                if (formData.questions && formData.questions.length > 0) {
                    formData.questions.forEach(question => {
                        if (question.type === 'checkbox') {
                            initialResponses[question.id] = [];
                        } else if (question.type === 'rating') {
                            initialResponses[question.id] = question.min || 1;
                        } else {
                            initialResponses[question.id] = '';
                        }
                    });
                }
                setResponses(initialResponses);
                setLoading(false);
            } catch (err) {
                setError('Form not found or an error occurred');
                setLoading(false);
            }
        };

        fetchFormAndLogView();
    }, [id]);

    const handleInputChange = (questionId, value, type = 'replace') => {
        setResponses(prev => {
            if (type === 'checkbox') {
                const currentValues = prev[questionId] || [];
                if (currentValues.includes(value)) {
                    return {
                        ...prev,
                        [questionId]: currentValues.filter(v => v !== value)
                    };
                } else {
                    return {
                        ...prev,
                        [questionId]: [...currentValues, value]
                    };
                }
            } else {
                return {
                    ...prev,
                    [questionId]: value
                };
            }
        });
    };

    const validateForm = () => {
        if (!form.questions) return true;
        
        for (const question of form.questions) {
            if (question.required) {
                const response = responses[question.id];
                if (!response || 
                    (Array.isArray(response) && response.length === 0) ||
                    (typeof response === 'string' && response.trim() === '')) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const submitData = {
                responses: responses,
                // Keep backward compatibility with old single-response format
                content: form.questions && form.questions.length > 0 ? 
                    JSON.stringify(responses) : responses.content || ''
            };
            
            const response = await api.post(`/forms/${id}/responses`, submitData);
            setMessage(response.data.message);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || 'An error occurred while submitting your response');
        } finally {
            setSubmitting(false);
        }
    };

    const getQuestionIcon = (type) => {
        const iconMap = {
            text: Type,
            textarea: AlignLeft,
            email: Mail,
            number: Hash,
            date: Calendar,
            radio: Circle,
            checkbox: CheckSquare,
            select: ChevronDown,
            rating: Star
        };
        return iconMap[type] || Type;
    };

    const renderQuestion = (question, index) => {
        const value = responses[question.id];
        const isRequired = question.required;
        const QuestionIcon = getQuestionIcon(question.type);

        const baseClasses = "w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";
        const labelClasses = `block text-gray-700 font-semibold mb-3 text-sm lg:text-base flex items-center gap-2`;

        switch (question.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type={question.type}
                            value={value || ''}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={baseClasses}
                            required={isRequired}
                            placeholder={`Enter your ${question.type === 'email' ? 'email address' : 'answer'}`}
                        />
                    </div>
                );

            case 'textarea':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            value={value || ''}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={`${baseClasses} resize-none`}
                            rows="4"
                            required={isRequired}
                            placeholder="Enter your detailed response here..."
                        />
                    </div>
                );

            case 'date':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="date"
                            value={value || ''}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={baseClasses}
                            required={isRequired}
                        />
                    </div>
                );

            case 'radio':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-3">
                            {question.options?.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500 focus:ring-2 mr-3"
                                        required={isRequired}
                                    />
                                    <span className="text-gray-700 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-3">
                            {question.options?.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={(value || []).includes(option)}
                                        onChange={() => handleInputChange(question.id, option, 'checkbox')}
                                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 mr-3"
                                    />
                                    <span className="text-gray-700 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'select':
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            value={value || ''}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={baseClasses}
                            required={isRequired}
                        >
                            <option value="">Select an option...</option>
                            {question.options?.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'rating':
                const min = question.min || 1;
                const max = question.max || 5;
                const stars = [];
                
                for (let i = min; i <= max; i++) {
                    stars.push(
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleInputChange(question.id, i)}
                            className={`text-3xl lg:text-4xl ${
                                i <= (value || min) ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 transition-all duration-200 hover:scale-110`}
                        >
                            ★
                        </button>
                    );
                }

                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                                {stars}
                            </div>
                            <div className="text-center">
                                <span className="text-lg font-semibold text-gray-700">
                                    {value || min} / {max}
                                </span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <label className={labelClasses}>
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                <QuestionIcon className="w-3 h-3 text-white" />
                            </div>
                            {question.question}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={baseClasses}
                            required={isRequired}
                            placeholder="Enter your answer"
                        />
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex justify-center items-center p-4">
                <div className="text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Loader className="w-10 h-10 text-white animate-spin" />
                        </div>
                        <p className="text-gray-600 text-xl font-semibold">Loading form...</p>
                        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your form</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Form Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The form you are looking for does not exist.'}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Handle legacy forms (backward compatibility)
    const hasQuestions = form.questions && form.questions.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                </button>
                                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl shadow-lg">
                                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        {form.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">{form.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                    {hasQuestions ? (
                        // New dynamic form questions
                        <>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                    </div>
                                    Questions ({form.questions.length})
                                </h3>
                                <div className="space-y-6">
                                    {form.questions.map((question, index) => renderQuestion(question, index))}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Legacy single textarea form
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm">
                                <label className="block text-gray-700 font-semibold mb-3 text-sm lg:text-base flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <AlignLeft className="w-3 h-3 text-white" />
                                    </div>
                                    Your Response *
                                </label>
                                <textarea
                                    value={responses.content || ''}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl lg:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows="6"
                                    required
                                    placeholder="Enter your response here..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8">
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className={`w-full py-4 lg:py-5 text-lg lg:text-xl font-bold rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 ${
                                submitting
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:scale-105'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    Submit Response
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`mt-6 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-center font-semibold shadow-lg flex items-center justify-center gap-3 ${
                        message.includes('successfully') || message.includes('submitted')
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200' 
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-200'
                    }`}>
                        {message.includes('successfully') || message.includes('submitted') ? (
                            <CheckCircle className="w-6 h-6" />
                        ) : (
                            <AlertCircle className="w-6 h-6" />
                        )}
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RespondForm;