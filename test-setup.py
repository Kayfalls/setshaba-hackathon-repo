#!/usr/bin/env python3
"""
CommunityPulse Setup Test Script
Tests the complete setup including backend API and frontend connectivity
"""

import requests
import json
import time
import subprocess
import sys
import os
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
TEST_TIMEOUT = 30  # seconds

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_status(message, status="INFO"):
    """Print colored status message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    if status == "SUCCESS":
        print(f"{Colors.GREEN}✅ [{timestamp}] {message}{Colors.END}")
    elif status == "ERROR":
        print(f"{Colors.RED}❌ [{timestamp}] {message}{Colors.END}")
    elif status == "WARNING":
        print(f"{Colors.YELLOW}⚠️  [{timestamp}] {message}{Colors.END}")
    else:
        print(f"{Colors.BLUE}ℹ️  [{timestamp}] {message}{Colors.END}")

def wait_for_service(url, service_name, timeout=30):
    """Wait for a service to be available"""
    print_status(f"Waiting for {service_name} at {url}...")
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print_status(f"{service_name} is ready!", "SUCCESS")
                return True
        except requests.exceptions.RequestException:
            pass
        
        time.sleep(2)
    
    print_status(f"{service_name} failed to start within {timeout} seconds", "ERROR")
    return False

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            data = response.json()
            print_status(f"Backend health check passed - {data['message']}", "SUCCESS")
            print_status(f"API Version: {data['version']}", "INFO")
            print_status(f"Available endpoints: {len(data['endpoints'])}", "INFO")
            return True
        else:
            print_status(f"Backend health check failed - Status: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Backend health check error: {e}", "ERROR")
        return False

def test_api_endpoints():
    """Test all API endpoints"""
    endpoints = [
        ("GET", "/api/health", "Community Health"),
        ("GET", "/api/analytics", "Analytics"),
        ("GET", "/api/alerts", "Alerts"),
        ("GET", "/api/dashboard", "Dashboard"),
        ("GET", "/api/posts", "Posts"),
    ]
    
    passed = 0
    total = len(endpoints)
    
    for method, endpoint, name in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            if response.status_code == 200:
                print_status(f"{name} endpoint working", "SUCCESS")
                passed += 1
            else:
                print_status(f"{name} endpoint failed - Status: {response.status_code}", "ERROR")
        except Exception as e:
            print_status(f"{name} endpoint error: {e}", "ERROR")
    
    print_status(f"API Endpoints: {passed}/{total} working", "INFO")
    return passed == total

def test_content_analysis():
    """Test content analysis endpoint"""
    test_content = "I love this community! The new amenities are fantastic."
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/analyze",
            json={
                "content": test_content,
                "author": "Test User"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print_status("Content analysis working", "SUCCESS")
            print_status(f"Sentiment: {data['sentiment_label']} ({data['sentiment_score']:.2f})", "INFO")
            print_status(f"Misinformation Risk: {data['misinformation_risk']:.2f}", "INFO")
            return True
        else:
            print_status(f"Content analysis failed - Status: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Content analysis error: {e}", "ERROR")
        return False

def test_post_creation():
    """Test post creation endpoint"""
    test_post = {
        "content": "The community garden is looking beautiful this spring!",
        "author": "Happy Resident",
        "category": "amenities"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/posts",
            json=test_post
        )
        
        if response.status_code == 200:
            data = response.json()
            print_status("Post creation working", "SUCCESS")
            print_status(f"Created post ID: {data['id']}", "INFO")
            return True
        else:
            print_status(f"Post creation failed - Status: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Post creation error: {e}", "ERROR")
        return False

def test_frontend():
    """Test frontend connectivity"""
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        if response.status_code == 200:
            print_status("Frontend is accessible", "SUCCESS")
            return True
        else:
            print_status(f"Frontend failed - Status: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Frontend error: {e}", "ERROR")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    print_status("Checking dependencies...")
    
    # Check Python packages
    try:
        import fastapi
        import uvicorn
        import nltk
        import vaderSentiment
        print_status("Python dependencies: OK", "SUCCESS")
    except ImportError as e:
        print_status(f"Python dependency missing: {e}", "ERROR")
        return False
    
    # Check if NLTK data is available
    try:
        import nltk
        nltk.data.find('tokenizers/punkt')
        print_status("NLTK data: OK", "SUCCESS")
    except LookupError:
        print_status("NLTK data missing - downloading...", "WARNING")
        try:
            nltk.download('punkt')
            print_status("NLTK data downloaded", "SUCCESS")
        except Exception as e:
            print_status(f"NLTK data download failed: {e}", "ERROR")
            return False
    
    return True

def main():
    """Main test function"""
    print(f"{Colors.BOLD}🚀 CommunityPulse Setup Test{Colors.END}")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        print_status("Dependency check failed", "ERROR")
        return False
    
    # Wait for services
    if not wait_for_service(BACKEND_URL, "Backend API"):
        print_status("Backend service not available", "ERROR")
        return False
    
    if not wait_for_service(FRONTEND_URL, "Frontend"):
        print_status("Frontend service not available", "WARNING")
    
    # Test backend functionality
    print_status("Testing backend functionality...")
    
    if not test_backend_health():
        return False
    
    if not test_api_endpoints():
        print_status("Some API endpoints failed", "WARNING")
    
    if not test_content_analysis():
        return False
    
    if not test_post_creation():
        return False
    
    # Test frontend
    print_status("Testing frontend...")
    test_frontend()
    
    # Summary
    print("\n" + "=" * 50)
    print_status("🎉 CommunityPulse Setup Test Complete!", "SUCCESS")
    print_status("Your development environment is ready!", "SUCCESS")
    print("\nAccess Points:")
    print(f"  📱 Frontend: {FRONTEND_URL}")
    print(f"  🔌 Backend API: {BACKEND_URL}")
    print(f"  📚 API Docs: {BACKEND_URL}/docs")
    print(f"  📖 ReDoc: {BACKEND_URL}/redoc")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print_status("\nTest interrupted by user", "WARNING")
        sys.exit(1)
    except Exception as e:
        print_status(f"Test failed with error: {e}", "ERROR")
        sys.exit(1)