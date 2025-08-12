import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Posts from './components/Posts';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import axios from 'axios';

function App() {
  const [communityHealth, setCommunityHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityHealth();
  }, []);

  const fetchCommunityHealth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/health');
      setCommunityHealth(response.data);
    } catch (error) {
      console.error('Error fetching community health:', error);
      // Use mock data if API is not available
      setCommunityHealth({
        community_health_score: 78.5,
        health_status: "Good",
        total_posts: 1247,
        recommendations: ["Monitor sentiment trends", "Address high-priority issues"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar communityHealth={communityHealth} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header communityHealth={communityHealth} loading={loading} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/alerts" element={<Alerts />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;