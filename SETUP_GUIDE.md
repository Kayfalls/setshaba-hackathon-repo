# CommunityPulse Development Setup Guide

Complete setup guide for the CommunityPulse AI Community Intelligence Platform.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Linux/macOS:**
```bash
./start-dev.sh
```

**Windows:**
```cmd
start-dev.bat
```

### Option 2: Manual Setup

**Terminal 1 (Backend):**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

### Option 3: Docker Setup

```bash
docker-compose up --build
```

## 📋 Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control
- **Docker** (optional, for containerized setup)

## 🏗 Project Structure

```
communitypulse/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── test_api.py         # API test script
│   ├── API_DOCUMENTATION.md # API documentation
│   └── Dockerfile         # Backend container
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml      # Multi-container setup
├── start-dev.sh           # Linux/macOS startup script
├── start-dev.bat          # Windows startup script
├── test-setup.py          # Complete setup test
└── README.md              # Project overview
```

## 🔧 Development Scripts

### Automated Startup Scripts

**Linux/macOS (`start-dev.sh`):**
- Checks prerequisites (Python, Node.js, npm)
- Creates virtual environment if needed
- Installs dependencies automatically
- Starts both backend and frontend
- Provides health checks and status updates
- Graceful shutdown with Ctrl+C

**Windows (`start-dev.bat`):**
- Similar functionality for Windows
- Opens services in separate command windows
- Automatic dependency installation

### Testing Scripts

**Complete Setup Test (`test-setup.py`):**
```bash
python test-setup.py
```

Tests:
- ✅ Dependency verification
- ✅ Backend API health
- ✅ All API endpoints
- ✅ Content analysis functionality
- ✅ Post creation
- ✅ Frontend connectivity

**API Tests (`backend/test_api.py`):**
```bash
cd backend
python test_api.py
```

## 🌐 Access Points

Once running, access the application at:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## 📊 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check and API information |
| `POST` | `/api/posts` | Submit community posts for analysis |
| `GET` | `/api/posts` | Retrieve analyzed posts with sentiment scores |
| `POST` | `/api/analyze` | Real-time content analysis (no storage) |
| `POST` | `/api/sentiment-analysis` | Sentiment analysis with confidence scores |
| `GET` | `/api/dashboard` | Community intelligence metrics |
| `GET` | `/api/health` | Community health score and recommendations |
| `GET` | `/api/analytics` | Detailed community analytics |
| `GET` | `/api/alerts` | Misinformation and high-priority alerts |

### Example API Usage

**Analyze Content:**
```bash
curl -X POST "http://localhost:8000/api/analyze" \
     -H "Content-Type: application/json" \
     -d '{"content": "I love this community!", "author": "Happy Resident"}'
```

**Get Community Health:**
```bash
curl http://localhost:8000/api/health
```

**Sentiment Analysis with Confidence:**
```bash
curl -X POST "http://localhost:8000/api/sentiment-analysis" \
     -H "Content-Type: application/json" \
     -d '{"content": "The new amenities are fantastic!", "author": "Sarah M."}'
```

## 🐳 Docker Setup

### Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Services

- **backend**: FastAPI application on port 8000
- **frontend**: React application on port 3000
- **redis**: Optional caching service (commented out)
- **db**: Optional PostgreSQL database (commented out)

### Docker Configuration

- **Volume Mounting**: Code changes reflect immediately
- **Environment Variables**: Configurable via docker-compose.yml
- **Health Checks**: Automatic service monitoring
- **Networking**: Isolated network for services

## 🔍 Troubleshooting

### Common Issues

**Backend Won't Start:**
```bash
# Check Python version
python3 --version

# Install dependencies
cd backend
pip install -r requirements.txt

# Download NLTK data
python3 -c "import nltk; nltk.download('punkt')"
```

**Frontend Won't Start:**
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill process if needed
kill -9 <PID>
```

**Database Issues:**
```bash
# Remove and recreate database
cd backend
rm community_pulse.db
python3 -c "from main import init_db; init_db()"
```

### Performance Issues

**Slow Startup:**
- Use Docker for consistent environment
- Pre-install dependencies
- Use production requirements for faster installs

**Memory Issues:**
- Monitor with `htop` or `top`
- Restart services if needed
- Consider using lighter dependencies

## 🧪 Testing

### Run All Tests

```bash
# Complete setup test
python test-setup.py

# API tests
cd backend && python test_api.py

# Frontend tests (if configured)
cd frontend && npm test
```

### Manual Testing

1. **Backend Health**: Visit http://localhost:8000
2. **API Documentation**: Visit http://localhost:8000/docs
3. **Frontend**: Visit http://localhost:3000
4. **Post Creation**: Use the frontend or API
5. **Sentiment Analysis**: Test with various content

## 📈 Monitoring

### Health Checks

- **Backend**: http://localhost:8000/
- **Frontend**: http://localhost:3000/
- **Docker**: `docker-compose ps`

### Logs

```bash
# Backend logs
cd backend && tail -f logs/app.log

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔒 Security

### Development Security

- CORS enabled for localhost
- No authentication required for demo
- Input validation on all endpoints
- Error handling without exposing internals

### Production Considerations

- Implement JWT authentication
- Configure specific CORS origins
- Use environment variables for secrets
- Enable HTTPS
- Add rate limiting

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Backend API Docs**: `backend/API_DOCUMENTATION.md`
- **Requirements Explanation**: `backend/REQUIREMENTS_EXPLANATION.md`

## 🚀 Deployment

### Production Setup

1. **Environment Variables**:
   ```bash
   export ENVIRONMENT=production
   export DATABASE_URL=postgresql://user:pass@host/db
   export SECRET_KEY=your-secret-key
   ```

2. **Build Production Images**:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

3. **Use Production Requirements**:
   ```bash
   pip install -r backend/requirements-prod.txt
   ```

### Cloud Deployment

- **Heroku**: Use Procfile and requirements.txt
- **AWS**: Use ECS or Lambda
- **Google Cloud**: Use Cloud Run
- **Azure**: Use App Service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the CommunityPulse 48-hour hackathon project.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Run the test scripts
4. Check the logs for errors

---

**Happy Coding! 🎉**