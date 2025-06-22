import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Sparkles,
  Home,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'My Forms',
      path: '/forms',
      icon: FileText,
      exact: false
    },
    {
      name: 'Create Form',
      path: '/create-form',
      icon: Plus,
      exact: true
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white/90 backdrop-blur-md border-r border-gray-200/50 shadow-2xl z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-gray-900 hover:text-indigo-600 transition-colors duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-xs text-gray-500 font-medium">Form Builder</p>
            </div>
          </Link>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  className={`
                    flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-medium transition-all duration-300 group
                    ${isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 transition-all duration-300 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Home</span>
              </Link>
              
              <button
                className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 transition-all duration-300 group"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Settings</span>
              </button>
              
              <button
                className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 transition-all duration-300 group"
              >
                <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600" />
      </div>

      {/* Mobile Menu Toggle Button - Only shown when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 text-gray-700 hover:text-indigo-600 transition-all duration-300 lg:hidden hover:shadow-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default Sidebar;