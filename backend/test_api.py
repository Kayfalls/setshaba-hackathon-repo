#!/usr/bin/env python3
"""
Test script for CommunityPulse API endpoints
Run this script to verify all endpoints are working correctly
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the root health check endpoint"""
    print("🔍 Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed - {data['message']}")
            print(f"   Version: {data['version']}")
            print(f"   Available endpoints: {len(data['endpoints'])}")
            return True
        else:
            print(f"❌ Health check failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_analyze_content():
    """Test the real-time content analysis endpoint"""
    print("\n🔍 Testing content analysis endpoint...")
    test_content = "This is a test post for analysis. I'm very happy with the community!"
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/analyze",
            json={
                "content": test_content,
                "author": "Test User"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Content analysis passed")
            print(f"   Sentiment: {data['sentiment_label']} ({data['sentiment_score']:.2f})")
            print(f"   Misinformation Risk: {data['misinformation_risk']:.2f}")
            print(f"   Priority Score: {data['priority_score']:.2f}")
            return True
        else:
            print(f"❌ Content analysis failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Content analysis error: {e}")
        return False

def test_create_post():
    """Test creating a new post"""
    print("\n🔍 Testing post creation...")
    test_post = {
        "content": "The new community garden is absolutely wonderful! Everyone loves it.",
        "author": "Happy Resident",
        "category": "amenities"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/posts",
            json=test_post
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Post creation passed")
            print(f"   Post ID: {data['id']}")
            print(f"   Sentiment: {data['sentiment_label']} ({data['sentiment_score']:.2f})")
            print(f"   Category: {data['category']}")
            return data['id']
        else:
            print(f"❌ Post creation failed - Status: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Post creation error: {e}")
        return None

def test_get_posts():
    """Test retrieving posts"""
    print("\n🔍 Testing posts retrieval...")
    try:
        response = requests.get(f"{BASE_URL}/api/posts?limit=5")
        
        if response.status_code == 200:
            posts = response.json()
            print(f"✅ Posts retrieval passed")
            print(f"   Retrieved {len(posts)} posts")
            if posts:
                print(f"   Latest post: {posts[0]['content'][:50]}...")
            return True
        else:
            print(f"❌ Posts retrieval failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Posts retrieval error: {e}")
        return False

def test_community_health():
    """Test community health endpoint"""
    print("\n🔍 Testing community health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Community health passed")
            print(f"   Health Score: {data['community_health_score']}/100")
            print(f"   Status: {data['health_status']}")
            print(f"   Total Posts: {data['total_posts']}")
            print(f"   Recommendations: {len(data['recommendations'])}")
            return True
        else:
            print(f"❌ Community health failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Community health error: {e}")
        return False

def test_analytics():
    """Test analytics endpoint"""
    print("\n🔍 Testing analytics endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/analytics")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Analytics passed")
            print(f"   Total Posts: {data['total_posts']}")
            print(f"   Avg Sentiment: {data['avg_sentiment']:.2f}")
            print(f"   Health Score: {data['community_health_score']}")
            return True
        else:
            print(f"❌ Analytics failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Analytics error: {e}")
        return False

def test_alerts():
    """Test alerts endpoint"""
    print("\n🔍 Testing alerts endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/alerts")
        
        if response.status_code == 200:
            alerts = response.json()
            print(f"✅ Alerts passed")
            print(f"   Total Alerts: {len(alerts)}")
            if alerts:
                print(f"   Latest alert: {alerts[0]['alert_type']} - {alerts[0]['severity']}")
            return True
        else:
            print(f"❌ Alerts failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Alerts error: {e}")
        return False

def test_dashboard():
    """Test dashboard endpoint"""
    print("\n🔍 Testing dashboard endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard passed")
            print(f"   Analytics: {data['analytics']['total_posts']} posts")
            print(f"   Recent Posts: {len(data['recent_posts'])}")
            print(f"   Alerts: {len(data['alerts'])}")
            print(f"   Top Issues: {len(data['top_issues'])}")
            return True
        else:
            print(f"❌ Dashboard failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🚀 CommunityPulse API Test Suite")
    print("=" * 50)
    
    # Wait a moment for the server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    tests = [
        ("Health Check", test_health_check),
        ("Content Analysis", test_analyze_content),
        ("Post Creation", test_create_post),
        ("Posts Retrieval", test_get_posts),
        ("Community Health", test_community_health),
        ("Analytics", test_analytics),
        ("Alerts", test_alerts),
        ("Dashboard", test_dashboard),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the server logs for details.")
    
    print(f"\n📚 API Documentation: {BASE_URL}/docs")
    print(f"📖 ReDoc: {BASE_URL}/redoc")

if __name__ == "__main__":
    main()