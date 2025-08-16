import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Import our mobile components
import Dashboard from './src/components/Dashboard';
import Posts from './src/components/Posts';
import Analytics from './src/components/Analytics';
import Alerts from './src/components/Alerts';

const Tab = createBottomTabNavigator();

// API Configuration
const API_BASE_URL = 'http://localhost:8000'; // Change this for production

export default function App() {
  const [communityHealth, setCommunityHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityHealth();
  }, []);

  const fetchCommunityHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
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
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Posts') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Analytics') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'Alerts') {
              iconName = focused ? 'warning' : 'warning-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          options={{ title: 'CommunityPulse' }}
        >
          {() => <Dashboard communityHealth={communityHealth} loading={loading} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Posts" 
          options={{ title: 'Community Posts' }}
        >
          {() => <Posts />}
        </Tab.Screen>
        <Tab.Screen 
          name="Analytics" 
          options={{ title: 'Analytics' }}
        >
          {() => <Analytics />}
        </Tab.Screen>
        <Tab.Screen 
          name="Alerts" 
          options={{ title: 'Alerts' }}
        >
          {() => <Alerts />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
