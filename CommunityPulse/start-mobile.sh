#!/bin/bash

# CommunityPulse Mobile App Startup Script

echo "🚀 Starting CommunityPulse Mobile App..."
echo "======================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from the CommunityPulse directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "📱 Choose how to run the app:"
echo "1. 📱 Expo Go (scan QR code)"
echo "2. 🌐 Web browser"
echo "3. 📱 Android simulator"
echo "4. 🍎 iOS simulator"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "📱 Starting with Expo Go..."
        echo "📱 Download Expo Go app on your phone and scan the QR code"
        npx expo start
        ;;
    2)
        echo "🌐 Starting in web browser..."
        npx expo start --web
        ;;
    3)
        echo "📱 Starting Android simulator..."
        npx expo start --android
        ;;
    4)
        echo "🍎 Starting iOS simulator..."
        npx expo start --ios
        ;;
    *)
        echo "❌ Invalid choice. Starting with Expo Go by default..."
        npx expo start
        ;;
esac