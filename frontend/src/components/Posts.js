import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    author: '',
    category: 'general'
  });

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
      misinformation_risk: 0.05,
      category: "maintenance",
      priority_score: 0.15
    },
    {
      id: 4,
      content: "Can we please address the noise complaints? Some residents are being very loud late at night.",
      author: "David K.",
      timestamp: "2024-01-07 11:20:00",
      sentiment_score: -0.3,
      sentiment_label: "negative",
      misinformation_risk: 0.1,
      category: "noise",
      priority_score: 0.6
    },
    {
      id: 5,
      content: "The community garden is looking beautiful this spring. Great work everyone!",
      author: "Lisa R.",
      timestamp: "2024-01-07 10:15:00",
      sentiment_score: 0.7,
      sentiment_label: "positive",
      misinformation_risk: 0.05,
      category: "amenities",
      priority_score: 0.1
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/posts', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ content: '', author: '', category: 'general' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Error submitting post. Please try again.');
    }
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

  const getPriorityColor = (score) => {
    if (score > 0.7) return 'bg-danger-100 text-danger-800';
    if (score > 0.4) return 'bg-warning-100 text-warning-800';
    return 'bg-success-100 text-success-800';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Posts</h1>
          <p className="mt-2 text-gray-600">Monitor and analyze community communications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* New Post Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="noise">Noise</option>
                <option value="amenities">Amenities</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your thoughts with the community..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{post.author}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center ${getSentimentColor(post.sentiment_score)}`}>
                      {getSentimentIcon(post.sentiment_score)}
                      <span className="ml-1">{post.sentiment_label}</span>
                      <span className="ml-1">({post.sentiment_score.toFixed(2)})</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(post.priority_score)}`}>
                      Priority: {(post.priority_score * 100).toFixed(0)}%
                    </span>
                    {post.misinformation_risk > 0.5 && (
                      <div className="flex items-center text-danger-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-xs">High Misinformation Risk</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positive Posts</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.sentiment_label === 'positive').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.priority_score > 0.7).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;