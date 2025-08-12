import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Eye, Filter, X } from 'lucide-react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Use mock data for demo
      setAlerts(getMockAlerts());
    } finally {
      setLoading(false);
    }
  };

  const getMockAlerts = () => [
    {
      id: 1,
      post_id: 2,
      alert_type: "misinformation",
      severity: "high",
      description: "Potential misinformation detected in post by John D.",
      timestamp: "2024-01-07 13:15:00"
    },
    {
      id: 2,
      post_id: 4,
      alert_type: "high_priority",
      severity: "medium",
      description: "High priority community concern: Can we please address the noise complaints?",
      timestamp: "2024-01-07 11:20:00"
    },
    {
      id: 3,
      post_id: 6,
      alert_type: "misinformation",
      severity: "high",
      description: "Potential misinformation detected in post by Mike T.",
      timestamp: "2024-01-07 10:45:00"
    },
    {
      id: 4,
      post_id: 8,
      alert_type: "high_priority",
      severity: "medium",
      description: "High priority community concern: There's a suspicious person hanging around",
      timestamp: "2024-01-07 09:30:00"
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'misinformation') return alert.alert_type === 'misinformation';
    if (filter === 'high_priority') return alert.alert_type === 'high_priority';
    return true;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'medium':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low':
        return 'bg-info-100 text-info-800 border-info-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'misinformation':
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
      case 'high_priority':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'misinformation':
        return 'text-danger-600';
      case 'high_priority':
        return 'text-warning-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-2 text-gray-600">Monitor misinformation and high-priority community concerns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Misinformation</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.alert_type === 'misinformation').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.alert_type === 'high_priority').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Alerts</option>
              <option value="misinformation">Misinformation</option>
              <option value="high_priority">High Priority</option>
            </select>
          </div>
        </div>

        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertTypeIcon(alert.alert_type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm font-medium ${getAlertTypeColor(alert.alert_type)}`}>
                          {alert.alert_type === 'misinformation' ? 'Misinformation Alert' : 'High Priority Alert'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        <span>Post ID: {alert.post_id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No alerts found</p>
            <p className="text-sm text-gray-400 mt-1">Great job! Your community is healthy.</p>
          </div>
        )}
      </div>

      {/* Alert Types Explanation */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Alert Types</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-danger-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Misinformation Alerts</h4>
              <p className="text-sm text-gray-600 mb-2">
                Posts that may contain false or misleading information based on:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Suspicious keywords and phrases</li>
                <li>• Excessive use of caps and exclamation marks</li>
                <li>• Urgency indicators without credible sources</li>
                <li>• Conspiracy theory language patterns</li>
              </ul>
            </div>
            <div className="border-l-4 border-warning-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">High Priority Alerts</h4>
              <p className="text-sm text-gray-600 mb-2">
                Posts that require immediate attention due to:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Negative sentiment with high engagement</li>
                <li>• Safety or security concerns</li>
                <li>• Community disruption issues</li>
                <li>• Maintenance emergencies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Response Guidelines */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Response Guidelines</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Misinformation Alerts:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review the content carefully before responding</li>
                <li>• Provide factual information from reliable sources</li>
                <li>• Address concerns without escalating conflict</li>
                <li>• Consider private communication for sensitive issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For High Priority Alerts:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Respond within 24 hours</li>
                <li>• Acknowledge the concern and provide timeline</li>
                <li>• Escalate to appropriate departments if needed</li>
                <li>• Follow up with resolution updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;