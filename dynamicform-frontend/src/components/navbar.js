import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  UserPlus, 
  LogIn, 
  LayoutDashboard,
  Sparkles,
  User
} from 'lucide-react';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-gray-900 hover:text-indigo-600 transition-colors duration-300"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              DynamicForm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/dashboard')
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/register')
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/login')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pb-4 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          {token ? (
            <>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActivePath('/dashboard')
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActivePath('/register')
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                Register
              </Link>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActivePath('/login')
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;