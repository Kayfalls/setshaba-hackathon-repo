import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = ({ communityHealth, loading: parentLoading }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
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
      },
      {
        id: 3,
        content: "The gym equipment maintenance was completed quickly and efficiently.",
        author: "Mike R.",
        timestamp: "2024-01-07 12:00:00",
        sentiment_score: 0.6,
        sentiment_label: "positive",
        misinformation_risk: 0.1,
        category: "maintenance",
        priority_score: 0.3
      }
    ]
  });

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return '#10B981';
    if (sentiment < -0.1) return '#EF4444';
    return '#F59E0B';
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const MetricCard = ({ title, value, icon, color = '#3B82F6', subtitle }) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const PostCard = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postAuthor}>{post.author}</Text>
        <View style={styles.postBadges}>
          <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(post.sentiment_score) }]}>
            <Text style={styles.badgeText}>{post.sentiment_label}</Text>
          </View>
          {post.misinformation_risk > 0.5 && (
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={12} color="#fff" />
            </View>
          )}
        </View>
      </View>
      <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
      <Text style={styles.postTime}>{new Date(post.timestamp).toLocaleString()}</Text>
    </View>
  );

  if (loading || parentLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const data = dashboardData?.analytics;
  
  // Chart data
  const lineChartData = {
    labels: data?.recent_trends?.daily_posts?.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        data: data?.recent_trends?.daily_posts?.map(d => d.count) || [],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Positive',
      population: data?.positive_posts || 0,
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Neutral',
      population: data?.neutral_posts || 0,
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Negative',
      population: data?.negative_posts || 0,
      color: '#EF4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Community Health Score */}
      <View style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <Ionicons name="heart" size={28} color={getHealthScoreColor(communityHealth?.community_health_score || 0)} />
          <Text style={styles.healthTitle}>Community Health</Text>
        </View>
        <Text style={[styles.healthScore, { color: getHealthScoreColor(communityHealth?.community_health_score || 0) }]}>
          {communityHealth?.community_health_score?.toFixed(1) || '0'}%
        </Text>
        <Text style={styles.healthStatus}>{communityHealth?.health_status || 'Unknown'}</Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsContainer}>
        <MetricCard
          title="Total Posts"
          value={data?.total_posts?.toLocaleString() || '0'}
          icon="chatbubbles"
          subtitle="This month"
        />
        <MetricCard
          title="Avg Sentiment"
          value={(data?.avg_sentiment || 0).toFixed(2)}
          icon="trending-up"
          color={getSentimentColor(data?.avg_sentiment || 0)}
          subtitle="Community mood"
        />
        <MetricCard
          title="Alerts"
          value={data?.misinformation_alerts || '0'}
          icon="warning"
          color="#EF4444"
          subtitle="Requires attention"
        />
      </View>

      {/* Charts */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Post Activity</Text>
        {data?.recent_trends?.daily_posts?.length > 0 && (
          <LineChart
            data={lineChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sentiment Distribution</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Recent Posts */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {dashboardData?.recent_posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  healthCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#374151',
  },
  healthScore: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  healthStatus: {
    fontSize: 16,
    color: '#6B7280',
  },
  metricsContainer: {
    paddingHorizontal: 16,
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  recentContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  postBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  alertBadge: {
    backgroundColor: '#EF4444',
    padding: 4,
    borderRadius: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default Dashboard;