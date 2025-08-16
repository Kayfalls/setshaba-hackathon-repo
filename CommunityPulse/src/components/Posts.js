import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    author: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use mock data for demo
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const getMockPosts = () => [
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
      content: "The maintenance team did an excellent job fixing the elevator quickly.",
      author: "Maria L.",
      timestamp: "2024-01-07 12:45:00",
      sentiment_score: 0.6,
      sentiment_label: "positive",
      misinformation_risk: 0.1,
      category: "maintenance",
      priority_score: 0.3
    },
    {
      id: 4,
      content: "Has anyone noticed the gym equipment being moved around? What's happening?",
      author: "Tom W.",
      timestamp: "2024-01-07 11:20:00",
      sentiment_score: -0.2,
      sentiment_label: "negative",
      misinformation_risk: 0.3,
      category: "amenities",
      priority_score: 0.4
    },
    {
      id: 5,
      content: "Great community BBQ last weekend! Looking forward to the next one.",
      author: "Lisa K.",
      timestamp: "2024-01-07 10:15:00",
      sentiment_score: 0.7,
      sentiment_label: "positive",
      misinformation_risk: 0.1,
      category: "events",
      priority_score: 0.2
    }
  ];

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return '#10B981';
    if (sentiment < -0.1) return '#EF4444';
    return '#F59E0B';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return 'trending-up';
    if (sentiment < -0.1) return 'trending-down';
    return 'remove';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'amenities': return 'fitness';
      case 'maintenance': return 'construct';
      case 'events': return 'calendar';
      case 'security': return 'shield';
      default: return 'chatbubble';
    }
  };

  const getPriorityColor = (priority) => {
    if (priority > 0.7) return '#EF4444';
    if (priority > 0.4) return '#F59E0B';
    return '#10B981';
  };

  const handleSubmitPost = async () => {
    if (!newPost.content.trim() || !newPost.author.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/posts', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ content: '', author: '', category: 'general' });
      setShowForm(false);
      Alert.alert('Success', 'Post submitted successfully!');
    } catch (error) {
      console.error('Error submitting post:', error);
      Alert.alert('Error', 'Failed to submit post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const PostCard = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorSection}>
          <Ionicons name="person-circle" size={32} color="#6B7280" />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.postTime}>{new Date(post.timestamp).toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Ionicons name={getCategoryIcon(post.category)} size={16} color="#6B7280" />
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postFooter}>
        <View style={styles.metricBadge}>
          <Ionicons 
            name={getSentimentIcon(post.sentiment_score)} 
            size={16} 
            color={getSentimentColor(post.sentiment_score)} 
          />
          <Text style={[styles.metricText, { color: getSentimentColor(post.sentiment_score) }]}>
            {post.sentiment_label}
          </Text>
        </View>

        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(post.priority_score) }]}>
          <Text style={styles.priorityText}>
            {post.priority_score > 0.7 ? 'High' : post.priority_score > 0.4 ? 'Med' : 'Low'} Priority
          </Text>
        </View>

        {post.misinformation_risk > 0.5 && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={16} color="#EF4444" />
            <Text style={styles.alertText}>Alert</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Community Posts</Text>
          <Text style={styles.subtitle}>{posts.length} posts</Text>
        </View>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowForm(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Post Creation Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity 
              onPress={handleSubmitPost}
              disabled={submitting}
            >
              <Text style={[styles.submitButton, submitting && styles.submitButtonDisabled]}>
                {submitting ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newPost.author}
                onChangeText={(text) => setNewPost({ ...newPost, author: text })}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {['general', 'amenities', 'maintenance', 'events', 'security'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newPost.category === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setNewPost({ ...newPost, category })}
                  >
                    <Ionicons 
                      name={getCategoryIcon(category)} 
                      size={16} 
                      color={newPost.category === category ? '#fff' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      newPost.category === category && styles.categoryButtonTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newPost.content}
                onChangeText={(text) => setNewPost({ ...newPost, content: text })}
                placeholder="What's on your mind?"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  scrollContainer: {
    flex: 1,
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
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  postContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  submitButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  submitButtonDisabled: {
    color: '#9CA3AF',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
});

export default Posts;