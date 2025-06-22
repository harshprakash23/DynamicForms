import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      setIsSuccess(true);
      setMessage('Login successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data || 'Login failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <LogIn className="w-6 h-6" />
              Sign In
            </h2>
          </div>

          {/* Card Body */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-lg pr-12"
                    placeholder="Enter your email address"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      email.trim() && email.includes('@') ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-lg pr-20"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-6">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      password.trim().length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim()}
                className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-6 rounded-2xl shadow-lg transform transition-all duration-500 ${
            isSuccess 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center gap-4">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-semibold text-lg ${
                  isSuccess ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isSuccess ? 'Success!' : 'Login Failed'}
                </p>
                <p className={`${
                  isSuccess ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Don't have an account yet?</p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold px-6 py-3 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </Link>
        </div>

        {/* Additional Links */}
        <div className="mt-6 flex justify-center gap-8 text-sm">
          <button className="text-gray-500 hover:text-indigo-600 transition-colors">
            Forgot Password?
          </button>
          <button className="text-gray-500 hover:text-indigo-600 transition-colors">
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;