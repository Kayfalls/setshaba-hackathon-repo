import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MessageSquare,
  Activity,
  Users,
  Clock,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for demo
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    analytics: {
      total_posts: 1247,
      avg_sentiment: 0.23,
      positive_posts: 456,
      negative_posts: 234,
      neutral_posts: 557,
      misinformation_alerts: 12,
      community_health_score: 78.5,
      recent_trends: {
        daily_posts: [
          { date: '2024-01-01', count: 45, avg_sentiment: 0.3 },
          { date: '2024-01-02', count: 52, avg_sentiment: 0.2 },
          { date: '2024-01-03', count: 38, avg_sentiment: 0.4 },
          { date: '2024-01-04', count: 61, avg_sentiment: 0.1 },
          { date: '2024-01-05', count: 48, avg_sentiment: 0.3 },
          { date: '2024-01-06', count: 55, avg_sentiment: 0.2 },
          { date: '2024-01-07', count: 42, avg_sentiment: 0.25 },
        ]
      }
    },
    recent_posts: [
      {
        id: 1,
        content: "The new pool hours are great! Everyone seems to be enjoying the extended time.",
        author: "Sarah M.",
        timestamp: "2024-01-07 14:30:00",
        sentiment_score: 0.8,
        sentiment_label: "positive",
        misinformation_risk: 0.1,
        category: "amenities",
        priority_score: 0.2
      },
      {
        id: 2,
        content: "URGENT: There's a conspiracy about the water quality! They're hiding something from us!",
        author: "John D.",
        timestamp: "2024-01-07 13:15:00",
        sentiment_score: -0.9,
        sentiment_label: "negative",
        misinformation_risk: 0.8,
        category: "maintenance",
        priority_score: 0.9
      }
    ],
    alerts: [
      {
        id: 1,
        post_id: 2,
        alert_type: "misinformation",
        severity: "high",
        description: "Potential misinformation detected in post by John D.",
        timestamp: "2024-01-07 13:15:00"
      }
    ],
    top_issues: [
      { category: "maintenance", count: 156, avg_sentiment: -0.2 },
      { category: "noise", count: 89, avg_sentiment: -0.4 },
      { category: "amenities", count: 234, avg_sentiment: 0.3 },
      { category: "security", count: 67, avg_sentiment: 0.1 }
    ]
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          dashboardData.analytics.positive_posts,
          dashboardData.analytics.neutral_posts,
          dashboardData.analytics.negative_posts
        ],
        backgroundColor: [
          '#22c55e',
          '#6b7280',
          '#ef4444'
        ],
        borderWidth: 0,
      },
    ],
  };

  const trendData = {
    labels: dashboardData.analytics.recent_trends.daily_posts.map(d => d.date),
    datasets: [
      {
        label: 'Posts per Day',
        data: dashboardData.analytics.recent_trends.daily_posts.map(d => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return 'text-success-600';
    if (score < -0.3) return 'text-danger-600';
    return 'text-gray-600';
  };

  const getSentimentIcon = (score) => {
    if (score > 0.3) return <TrendingUp className="h-4 w-4 text-success-600" />;
    if (score < -0.3) return <TrendingDown className="h-4 w-4 text-danger-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="lg:ml-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time community intelligence and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.total_posts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Activity className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.community_health_score}/100</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.misinformation_alerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Activity Trend</h3>
          <div className="h-64">
            <Line 
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={sentimentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
          </div>
          <div className="p-6 space-y-4">
            {dashboardData.recent_posts.map((post) => (
              <div key={post.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      <span className={`flex items-center ${getSentimentColor(post.sentiment_score)}`}>
                        {getSentimentIcon(post.sentiment_score)}
                        <span className="ml-1">{post.sentiment_label}</span>
                      </span>
                    </div>
                  </div>
                  {post.misinformation_risk > 0.5 && (
                    <div className="ml-2">
                      <AlertTriangle className="h-4 w-4 text-danger-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          </div>
          <div className="p-6 space-y-4">
            {dashboardData.alerts.length > 0 ? (
              dashboardData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-danger-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.description}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.severity === 'high' 
                          ? 'bg-danger-100 text-danger-800' 
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Community Issues</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.top_issues.map((issue, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 capitalize">{issue.category}</h4>
                <p className="text-2xl font-bold text-primary-600">{issue.count}</p>
                <p className="text-sm text-gray-500">posts</p>
                <div className={`flex items-center justify-center mt-2 ${getSentimentColor(issue.avg_sentiment)}`}>
                  {getSentimentIcon(issue.avg_sentiment)}
                  <span className="ml-1 text-xs">{issue.avg_sentiment.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;