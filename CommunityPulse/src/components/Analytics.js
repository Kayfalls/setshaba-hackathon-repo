import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/analytics');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Use mock data for demo
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const getMockAnalyticsData = () => ({
    sentiment_trends: {
      daily_sentiment: [
        { date: '2024-01-01', avg_sentiment: 0.3, post_count: 45 },
        { date: '2024-01-02', avg_sentiment: 0.2, post_count: 52 },
        { date: '2024-01-03', avg_sentiment: 0.4, post_count: 38 },
        { date: '2024-01-04', avg_sentiment: 0.1, post_count: 61 },
        { date: '2024-01-05', avg_sentiment: 0.3, post_count: 48 },
        { date: '2024-01-06', avg_sentiment: 0.2, post_count: 55 },
        { date: '2024-01-07', avg_sentiment: 0.25, post_count: 42 },
      ]
    },
    category_breakdown: [
      { category: 'Maintenance', count: 156, avg_sentiment: 0.1 },
      { category: 'Amenities', count: 98, avg_sentiment: 0.4 },
      { category: 'Events', count: 73, avg_sentiment: 0.6 },
      { category: 'Security', count: 45, avg_sentiment: -0.1 },
      { category: 'General', count: 234, avg_sentiment: 0.2 },
    ],
    sentiment_distribution: {
      positive: 456,
      neutral: 557,
      negative: 234
    },
    key_metrics: {
      total_posts: 1247,
      avg_sentiment: 0.23,
      engagement_rate: 0.78,
      response_time: 4.2,
      satisfaction_score: 7.8,
      misinformation_rate: 0.03
    },
    top_issues: [
      { issue: 'Pool maintenance delays', severity: 0.8, mentions: 45 },
      { issue: 'Parking space shortage', severity: 0.7, mentions: 32 },
      { issue: 'Gym equipment issues', severity: 0.6, mentions: 28 },
      { issue: 'Noise complaints', severity: 0.5, mentions: 19 },
      { issue: 'Internet connectivity', severity: 0.4, mentions: 15 }
    ]
  });

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return '#10B981';
    if (sentiment < -0.1) return '#EF4444';
    return '#F59E0B';
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'total_posts': return 'chatbubbles';
      case 'avg_sentiment': return 'trending-up';
      case 'engagement_rate': return 'heart';
      case 'response_time': return 'time';
      case 'satisfaction_score': return 'star';
      case 'misinformation_rate': return 'warning';
      default: return 'analytics';
    }
  };

  const MetricCard = ({ title, value, icon, color = '#3B82F6', unit = '', trend }) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>
        {value}{unit}
      </Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend > 0 ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={trend > 0 ? '#10B981' : '#EF4444'} 
          />
          <Text style={[styles.trendText, { color: trend > 0 ? '#10B981' : '#EF4444' }]}>
            {Math.abs(trend)}% vs last week
          </Text>
        </View>
      )}
    </View>
  );

  const IssueCard = ({ issue, index }) => (
    <View style={styles.issueCard}>
      <View style={styles.issueHeader}>
        <Text style={styles.issueRank}>#{index + 1}</Text>
        <View style={styles.issueContent}>
          <Text style={styles.issueTitle}>{issue.issue}</Text>
          <Text style={styles.issueMentions}>{issue.mentions} mentions</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSentimentColor(-issue.severity) }]}>
          <Text style={styles.severityText}>
            {issue.severity > 0.7 ? 'High' : issue.severity > 0.4 ? 'Med' : 'Low'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  const data = analyticsData;

  // Chart configurations
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
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

  // Sentiment trends chart data
  const sentimentChartData = {
    labels: data?.sentiment_trends?.daily_sentiment?.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        data: data?.sentiment_trends?.daily_sentiment?.map(d => d.avg_sentiment) || [],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Category breakdown chart data
  const categoryChartData = {
    labels: data?.category_breakdown?.map(c => c.category) || [],
    datasets: [
      {
        data: data?.category_breakdown?.map(c => c.count) || [],
      },
    ],
  };

  // Sentiment distribution pie chart
  const pieChartData = [
    {
      name: 'Positive',
      population: data?.sentiment_distribution?.positive || 0,
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Neutral',
      population: data?.sentiment_distribution?.neutral || 0,
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Negative',
      population: data?.sentiment_distribution?.negative || 0,
      color: '#EF4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Community insights and trends</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <MetricCard
          title="Total Posts"
          value={data?.key_metrics?.total_posts?.toLocaleString() || '0'}
          icon="chatbubbles"
          trend={12}
        />
        <MetricCard
          title="Avg Sentiment"
          value={(data?.key_metrics?.avg_sentiment || 0).toFixed(2)}
          icon="trending-up"
          color={getSentimentColor(data?.key_metrics?.avg_sentiment || 0)}
          trend={5}
        />
        <MetricCard
          title="Engagement Rate"
          value={((data?.key_metrics?.engagement_rate || 0) * 100).toFixed(1)}
          icon="heart"
          color="#EC4899"
          unit="%"
          trend={-3}
        />
        <MetricCard
          title="Response Time"
          value={(data?.key_metrics?.response_time || 0).toFixed(1)}
          icon="time"
          color="#8B5CF6"
          unit=" hrs"
          trend={-8}
        />
        <MetricCard
          title="Satisfaction Score"
          value={(data?.key_metrics?.satisfaction_score || 0).toFixed(1)}
          icon="star"
          color="#F59E0B"
          unit="/10"
          trend={15}
        />
        <MetricCard
          title="Misinformation Rate"
          value={((data?.key_metrics?.misinformation_rate || 0) * 100).toFixed(1)}
          icon="warning"
          color="#EF4444"
          unit="%"
          trend={-25}
        />
      </View>

      {/* Sentiment Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sentiment Trends (7 Days)</Text>
        {data?.sentiment_trends?.daily_sentiment?.length > 0 && (
          <LineChart
            data={sentimentChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      {/* Category Breakdown Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Posts by Category</Text>
        {data?.category_breakdown?.length > 0 && (
          <BarChart
            data={categoryChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        )}
      </View>

      {/* Sentiment Distribution */}
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

      {/* Top Issues */}
      <View style={styles.issuesContainer}>
        <Text style={styles.sectionTitle}>Top Community Issues</Text>
        {data?.top_issues?.map((issue, index) => (
          <IssueCard key={index} issue={issue} index={index} />
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
  headerSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    marginTop: 8,
  },
  metricsContainer: {
    padding: 16,
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
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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
  issuesContainer: {
    padding: 16,
  },
  issueCard: {
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
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 12,
    width: 30,
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  issueMentions: {
    fontSize: 12,
    color: '#6B7280',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
});

export default Analytics;