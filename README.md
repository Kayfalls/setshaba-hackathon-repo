# CommunityPulse - AI Community Intelligence Platform

A 48-hour hackathon project that leverages AI to analyze community communication, prevent misinformation, and provide actionable insights to property managers and community leaders.

## 🚀 Features

- **Real-time Sentiment Analysis**: Analyze community posts for sentiment trends
- **Misinformation Detection**: AI-powered alerts for potential misinformation
- **Community Health Scoring**: Overall community wellness metrics
- **Property Manager Dashboard**: Actionable insights and priority rankings
- **Mobile-Responsive Design**: Works seamlessly on all devices

## 🛠 Tech Stack

- **Backend**: Python + FastAPI + SQLite
- **Frontend**: React + Tailwind CSS + Chart.js
- **AI/ML**: NLTK, VADER sentiment analysis, scikit-learn
- **Deployment**: Docker-ready

## 🏃‍♂️ Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd communitypulse

# Start all services with one command
./start.sh

# Or manually with Docker Compose
docker-compose up --build
```

### Option 2: Development Setup
```bash
# Run the development setup script
./dev-setup.sh

# Start backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Start frontend (Terminal 2)
cd frontend
npm start
```

### Option 3: Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 -c "import nltk; nltk.download('punkt')"
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 API Endpoints

- `POST /api/posts` - Submit community posts for analysis
- `GET /api/analytics` - Get community health metrics
- `GET /api/alerts` - Get misinformation alerts
- `GET /api/dashboard` - Get dashboard data
- `GET /api/posts` - Get paginated list of posts

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API Explorer**: http://localhost:8000/redoc

## 🎯 Core Features

1. **Community Post Analysis**: Real-time processing of community communications
2. **Sentiment Tracking**: Monitor community mood and satisfaction
3. **Issue Prioritization**: AI-powered ranking of community concerns
4. **Misinformation Alerts**: Early warning system for potential issues

## 🔒 Security

- JWT authentication
- Input validation and sanitization
- Rate limiting
- CORS protection

## 📱 Mobile-First Design

Built with Tailwind CSS for optimal mobile experience and responsive design across all devices.

## 🚀 Demo Features

The application comes with realistic sample data including:
- 10+ community posts with varying sentiment scores
- Misinformation detection examples
- High-priority alerts
- Community health metrics
- Interactive charts and analytics

## 🛠 Development

### Project Structure
```
communitypulse/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml      # Multi-container setup
├── start.sh               # Quick start script
└── dev-setup.sh           # Development setup
```

### Key Technologies
- **Backend**: FastAPI, SQLite, NLTK, VADER Sentiment Analysis
- **Frontend**: React 18, Tailwind CSS, Chart.js, Lucide Icons
- **AI/ML**: Sentiment analysis, misinformation detection, priority scoring
- **Deployment**: Docker, Docker Compose

## 📈 Performance

- **Real-time Analysis**: Posts analyzed instantly with AI
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fast Loading**: Optimized bundle sizes and lazy loading
- **Scalable Architecture**: Microservices ready for production