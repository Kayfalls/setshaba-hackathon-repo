import React from 'react';
import { Bell, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">CommunityPulse</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span>•</span>
            <span>AI-Powered Community Intelligence</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900">Property Manager</div>
              <div className="text-xs text-gray-500">admin@community.com</div>
            </div>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;