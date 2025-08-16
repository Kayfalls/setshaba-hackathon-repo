# CommunityPulse - Mobile App

A React Native mobile application for AI-powered community intelligence and management.

## 🚀 Features

- **📱 Native Mobile Experience**: Built with React Native for iOS and Android
- **📊 Real-time Dashboard**: Community health metrics and analytics
- **💬 Community Posts**: View and create community posts with sentiment analysis
- **📈 Analytics**: Comprehensive charts and insights
- **🚨 Smart Alerts**: AI-powered misinformation detection and priority alerts
- **🔄 Pull-to-Refresh**: Real-time data updates
- **📱 Mobile-First Design**: Optimized for touch interactions

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **React Navigation**: Native navigation patterns
- **React Native Chart Kit**: Mobile-optimized charts
- **Ionicons**: Native icon set
- **Axios**: HTTP client for API communication

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device (for testing)

### Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm start
```

3. **Run on device/simulator**:
- **iOS**: `npm run ios` (requires macOS)
- **Android**: `npm run android`
- **Web**: `npm run web`
- **Expo Go**: Scan QR code with Expo Go app

## 📊 App Structure

```
CommunityPulse/
├── App.js                 # Main app with navigation
├── src/
│   └── components/        # Screen components
│       ├── Dashboard.js   # Community health dashboard
│       ├── Posts.js       # Posts feed and creation
│       ├── Analytics.js   # Charts and metrics
│       └── Alerts.js      # Alert management
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎯 Key Features

### 📊 Dashboard
- Community health score with visual indicators
- Key metrics cards with trends
- Interactive charts (Line, Pie charts)
- Recent posts overview
- Pull-to-refresh functionality

### 💬 Posts
- Infinite scroll post feed
- Create new posts with categories
- Sentiment analysis indicators
- Priority and alert badges
- Real-time posting with form validation

### 📈 Analytics
- Multiple chart types for data visualization
- Key performance indicators
- Sentiment trends over time
- Category breakdown
- Top community issues ranking

### 🚨 Alerts
- Priority-based alert filtering
- Misinformation detection alerts
- Interactive alert management
- Suggested actions for each alert
- Status tracking and updates

## 🎨 Design System

### Color Palette
- **Primary**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Gray Scale**: #F3F4F6, #6B7280, #374151, #111827

### Typography
- **Headers**: Bold, 18-24px
- **Body**: Regular, 14-16px
- **Captions**: Medium, 12px

### Spacing
- Consistent 16px padding/margins
- 12px border radius for cards
- 8px gap between elements

## 🔧 Configuration

### API Configuration
Update the API base URL in `App.js`:
```javascript
const API_BASE_URL = 'http://your-api-server.com'; // Change for production
```

### Backend Requirements
The mobile app expects the following API endpoints:
- `GET /api/health` - Community health data
- `GET /api/dashboard` - Dashboard metrics
- `GET /api/posts` - Posts list
- `POST /api/posts` - Create new post
- `GET /api/analytics` - Analytics data
- `GET /api/alerts` - Alert data

## 📱 Mobile-Specific Features

### Navigation
- **Bottom Tab Navigation**: Easy thumb navigation
- **Native Headers**: Platform-appropriate styling
- **Deep Linking**: URL scheme support

### User Experience
- **Pull-to-Refresh**: Native refresh controls
- **Touch Feedback**: Proper touch states
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Offline Support**: Graceful degradation

### Performance
- **Optimized Rendering**: Efficient list rendering
- **Image Optimization**: Proper image handling
- **Memory Management**: Proper cleanup
- **Bundle Optimization**: Minimal app size

## 🚀 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Expo Updates
```bash
expo publish
```

## 🔐 Security Considerations

- API endpoint validation
- Secure storage for sensitive data
- Input sanitization
- Error handling without data exposure
- Network request timeout handling

## 🧪 Testing

### Manual Testing
- Test on both iOS and Android devices
- Verify all navigation flows
- Test pull-to-refresh functionality
- Validate form submissions
- Check chart rendering

### Automated Testing (Future)
- Unit tests for components
- Integration tests for API calls
- E2E testing with Detox

## 📈 Performance Monitoring

- Monitor app performance with Expo Analytics
- Track crash reports
- Monitor API response times
- User engagement analytics

## 🔮 Future Enhancements

- **Push Notifications**: Real-time alert notifications
- **Offline Mode**: Cache data for offline viewing
- **Dark Mode**: Theme switching support
- **Biometric Auth**: Fingerprint/Face ID login
- **Camera Integration**: Photo posts
- **Social Features**: User profiles and interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on devices
5. Submit a pull request

## 📄 License

This project is part of the CommunityPulse hackathon submission.

## 🆘 Troubleshooting

### Common Issues

**App won't start:**
- Check Node.js version
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Charts not rendering:**
- Ensure react-native-chart-kit is properly installed
- Check device orientation
- Verify data format

**API connection issues:**
- Update API_BASE_URL in App.js
- Check network connectivity
- Verify backend is running

**Build issues:**
- Check Expo CLI version
- Update dependencies
- Clear Expo cache: `expo r -c`

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review Expo documentation
- Contact the development team