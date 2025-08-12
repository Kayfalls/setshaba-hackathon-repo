import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use mock data for demo
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
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
          analytics.positive_posts,
          analytics.neutral_posts,
          analytics.negative_posts
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
    labels: analytics.recent_trends.daily_posts.map(d => d.date),
    datasets: [
      {
        label: 'Posts per Day',
        data: analytics.recent_trends.daily_posts.map(d => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const sentimentTrendData = {
    labels: analytics.recent_trends.daily_posts.map(d => d.date),
    datasets: [
      {
        label: 'Average Sentiment',
        data: analytics.recent_trends.daily_posts.map(d => d.avg_sentiment),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Maintenance', 'Noise', 'Amenities', 'Security', 'General'],
    datasets: [
      {
        label: 'Posts by Category',
        data: [156, 89, 234, 67, 701],
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#22c55e',
          '#f59e0b',
          '#6b7280'
        ],
      },
    ],
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Deep insights into community health and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total_posts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${getHealthScoreBg(analytics.community_health_score)}`}>
              <Activity className={`h-6 w-6 ${getHealthScoreColor(analytics.community_health_score)}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(analytics.community_health_score)}`}>
                {analytics.community_health_score}/100
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avg_sentiment.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.misinformation_alerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Activity Trend */}
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
          <div className="h-64">
            <Line 
              data={sentimentTrendData}
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
                    min: -1,
                    max: 1,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts by Category</h3>
          <div className="h-64">
            <Bar 
              data={categoryData}
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
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success-600">{analytics.positive_posts}</div>
              <div className="text-sm text-gray-600">Positive Posts</div>
              <div className="text-xs text-gray-500 mt-1">
                {((analytics.positive_posts / analytics.total_posts) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{analytics.neutral_posts}</div>
              <div className="text-sm text-gray-600">Neutral Posts</div>
              <div className="text-xs text-gray-500 mt-1">
                {((analytics.neutral_posts / analytics.total_posts) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-danger-600">{analytics.negative_posts}</div>
              <div className="text-sm text-gray-600">Negative Posts</div>
              <div className="text-xs text-gray-500 mt-1">
                {((analytics.negative_posts / analytics.total_posts) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Community Health Score Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Health Score</span>
                <span className={`font-medium ${getHealthScoreColor(analytics.community_health_score)}`}>
                  {analytics.community_health_score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    analytics.community_health_score >= 80 ? 'bg-success-500' :
                    analytics.community_health_score >= 60 ? 'bg-warning-500' : 'bg-danger-500'
                  }`}
                  style={{ width: `${analytics.community_health_score}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Positive Sentiment Impact</span>
                <span className="text-success-600">+{((analytics.positive_posts / analytics.total_posts) * 30).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Negative Sentiment Impact</span>
                <span className="text-danger-600">-{((analytics.negative_posts / analytics.total_posts) * 30).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Misinformation Penalty</span>
                <span className="text-danger-600">-{((analytics.misinformation_alerts / analytics.total_posts) * 20).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Score</span>
                <span className="text-gray-600">50.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;