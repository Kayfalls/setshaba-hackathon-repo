import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, high, medium, low

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getMockAlerts = () => [
    {
      id: 1,
      type: 'misinformation',
      priority: 'high',
      title: 'Potential Misinformation Detected',
      description: 'Post contains conspiracy claims about water quality without factual basis',
      content: "URGENT: There's a conspiracy about the water quality! They're hiding something from us!",
      author: 'John D.',
      timestamp: '2024-01-07 13:15:00',
      confidence: 0.89,
      status: 'active',
      category: 'maintenance',
      suggested_action: 'Immediate review and fact-checking required'
    },
    {
      id: 2,
      type: 'sentiment',
      priority: 'high',
      title: 'Negative Sentiment Spike',
      description: 'Unusual spike in negative sentiment regarding pool maintenance',
      content: 'The pool has been closed for weeks now with no updates. This is unacceptable!',
      author: 'Multiple Users',
      timestamp: '2024-01-07 12:30:00',
      confidence: 0.95,
      status: 'active',
      category: 'amenities',
      suggested_action: 'Provide community update on pool maintenance timeline'
    },
    {
      id: 3,
      type: 'priority',
      priority: 'medium',
      title: 'High Priority Issue Identified',
      description: 'Parking concerns reaching critical discussion levels',
      content: 'Parking situation is getting worse every day. Need immediate action.',
      author: 'Sarah M.',
      timestamp: '2024-01-07 11:45:00',
      confidence: 0.76,
      status: 'investigating',
      category: 'general',
      suggested_action: 'Schedule parking committee meeting'
    },
    {
      id: 4,
      type: 'misinformation',
      priority: 'medium',
      title: 'Misleading Information Alert',
      description: 'Post contains unverified claims about security measures',
      content: 'I heard they removed half the security cameras without telling anyone.',
      author: 'Tom W.',
      timestamp: '2024-01-07 10:20:00',
      confidence: 0.72,
      status: 'reviewing',
      category: 'security',
      suggested_action: 'Clarify security measures to community'
    },
    {
      id: 5,
      type: 'engagement',
      priority: 'low',
      title: 'Low Engagement Notice',
      description: 'Recent community event announcements receiving minimal response',
      content: 'Community BBQ this weekend - please join us!',
      author: 'Community Manager',
      timestamp: '2024-01-07 09:00:00',
      confidence: 0.84,
      status: 'monitoring',
      category: 'events',
      suggested_action: 'Consider alternative promotion strategies'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'misinformation': return 'warning';
      case 'sentiment': return 'trending-down';
      case 'priority': return 'flag';
      case 'engagement': return 'chatbubbles';
      default: return 'alert-circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#EF4444';
      case 'investigating': return '#F59E0B';
      case 'reviewing': return '#3B82F6';
      case 'monitoring': return '#10B981';
      case 'resolved': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleAlertAction = (alertId, action) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this alert?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Update alert status
            setAlerts(alerts.map(alert => 
              alert.id === alertId 
                ? { ...alert, status: action === 'resolve' ? 'resolved' : 'investigating' }
                : alert
            ));
          }
        }
      ]
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.priority === filter;
  });

  const FilterButton = ({ label, value, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive
      ]}
      onPress={() => setFilter(value)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === value && styles.filterButtonTextActive
      ]}>
        {label} {count > 0 && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  const AlertCard = ({ alert }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.alertIconContainer}>
          <Ionicons 
            name={getAlertIcon(alert.type)} 
            size={24} 
            color={getPriorityColor(alert.priority)} 
          />
        </View>
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertDescription}>{alert.description}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
          <Text style={styles.priorityText}>{alert.priority.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.alertContent}>
        <Text style={styles.alertPostContent} numberOfLines={3}>
          "{alert.content}"
        </Text>
        <View style={styles.alertMeta}>
          <Text style={styles.alertAuthor}>- {alert.author}</Text>
          <Text style={styles.alertTime}>
            {new Date(alert.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.alertDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="analytics" size={16} color="#6B7280" />
          <Text style={styles.detailText}>Confidence: {(alert.confidence * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="folder" size={16} color="#6B7280" />
          <Text style={styles.detailText}>Category: {alert.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alert.status) }]}>
          <Text style={styles.statusText}>{alert.status}</Text>
        </View>
      </View>

      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionLabel}>Suggested Action:</Text>
        <Text style={styles.suggestionText}>{alert.suggested_action}</Text>
      </View>

      {alert.status !== 'resolved' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.investigateButton]}
            onPress={() => handleAlertAction(alert.id, 'investigate')}
          >
            <Ionicons name="search" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Investigate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.resolveButton]}
            onPress={() => handleAlertAction(alert.id, 'resolve')}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  const alertCounts = {
    all: alerts.length,
    high: alerts.filter(a => a.priority === 'high').length,
    medium: alerts.filter(a => a.priority === 'medium').length,
    low: alerts.filter(a => a.priority === 'low').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Community Alerts</Text>
        <Text style={styles.subtitle}>
          {alertCounts.all} active alerts • {alertCounts.high} high priority
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton label="All" value="all" count={alertCounts.all} />
          <FilterButton label="High" value="high" count={alertCounts.high} />
          <FilterButton label="Medium" value="medium" count={alertCounts.medium} />
          <FilterButton label="Low" value="low" count={alertCounts.low} />
        </ScrollView>
      </View>

      {/* Alerts List */}
      <ScrollView
        style={styles.alertsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.emptyTitle}>No Alerts Found</Text>
            <Text style={styles.emptyDescription}>
              {filter === 'all' 
                ? 'Great! No alerts to review at this time.'
                : `No ${filter} priority alerts found.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  alertsList: {
    flex: 1,
  },
  alertCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  alertContent: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertPostContent: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertAuthor: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  suggestionContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#3B82F6',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  investigateButton: {
    backgroundColor: '#F59E0B',
  },
  resolveButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Alerts;