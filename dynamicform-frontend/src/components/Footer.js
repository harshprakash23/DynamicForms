import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Mail, Shield, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 mt-20">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent mb-12"></div>
      
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-t-3xl shadow-2xl">
        <div className="container mx-auto px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dynamic Forms
                </h3>
              </div>
              <p className="text-gray-600 text-lg mb-6 max-w-md">
                Create beautiful, responsive forms with ease. Built for modern teams who value simplicity and powerful features.
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for better user experiences</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resources
              </h4>
              <div className="space-y-3">
                <Link 
                  to="/privacy-policy" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 group"
                >
                  <Shield className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 group"
                >
                  <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Terms of Service
                </Link>
                <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 group">
                  <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Contact Support
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <div className="text-gray-600">
                  <p className="font-medium">Support</p>
                  <p className="text-sm">support@dynamicforms.com</p>
                </div>
                <div className="text-gray-600">
                  <p className="font-medium">Sales</p>
                  <p className="text-sm">sales@dynamicforms.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-500 text-sm">
                © 2025 Dynamic Form App. All rights reserved.
              </div>
              
              {/* Social Links or Additional Info */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <button className="hover:text-indigo-600 transition-colors">
                  Documentation
                </button>
                <button className="hover:text-indigo-600 transition-colors">
                  API Reference
                </button>
                <button className="hover:text-indigo-600 transition-colors">
                  Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;