import React from 'react';
import { Bell, User, Settings, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const Header = ({ communityHealth, loading }) => {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-50';
    if (score >= 60) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  const getHealthIcon = (score) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <Activity className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CommunityPulse</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span>•</span>
            <span>AI-Powered Community Intelligence</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Community Health Score */}
          {!loading && communityHealth && (
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg ${getHealthColor(communityHealth.community_health_score)}`}>
              {getHealthIcon(communityHealth.community_health_score)}
              <div className="text-sm font-medium">
                <span className="hidden lg:inline">Health: </span>
                {communityHealth.community_health_score}/100
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
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