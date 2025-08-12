# CommunityPulse Backend API

A complete FastAPI application for the CommunityPulse AI Community Intelligence Platform.

## 🚀 Features

- **Real-time AI Analysis**: VADER sentiment analysis and misinformation detection
- **Community Health Scoring**: Comprehensive wellness metrics (0-100 scale)
- **RESTful API**: Complete CRUD operations with proper validation
- **SQLite Database**: Lightweight, file-based database with auto-schema creation
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Interactive Documentation**: Auto-generated Swagger UI and ReDoc
- **Sample Data**: Realistic demo data for testing and demonstration

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check and API information |
| `POST` | `/api/posts` | Submit community posts for analysis |
| `GET` | `/api/posts` | Retrieve analyzed posts with sentiment scores |
| `POST` | `/api/analyze` | Real-time content analysis (no storage) |
| `GET` | `/api/dashboard` | Community intelligence metrics |
| `GET` | `/api/health` | Community health score and recommendations |
| `GET` | `/api/analytics` | Detailed community analytics |
| `GET` | `/api/alerts` | Misinformation and high-priority alerts |

## 🛠 Installation & Setup

### Prerequisites
- Python 3.8+
- pip

### Quick Start

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the application:**
```bash
uvicorn main:app --reload
```

3. **Access the API:**
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Docker Setup

```bash
# Build and run with Docker
docker build -t communitypulse-backend .
docker run -p 8000:8000 communitypulse-backend

# Or use Docker Compose from the root directory
docker-compose up backend
```

## 🧪 Testing

### Run API Tests
```bash
# Make sure the server is running first
python test_api.py
```

### Manual Testing with curl

1. **Health Check:**
```bash
curl http://localhost:8000/
```

2. **Analyze Content:**
```bash
curl -X POST "http://localhost:8000/api/analyze" \
     -H "Content-Type: application/json" \
     -d '{"content": "I love this community!", "author": "Happy Resident"}'
```

3. **Create Post:**
```bash
curl -X POST "http://localhost:8000/api/posts" \
     -H "Content-Type: application/json" \
     -d '{"content": "The new pool is amazing!", "author": "Sarah M.", "category": "amenities"}'
```

4. **Get Community Health:**
```bash
curl http://localhost:8000/api/health
```

## 📊 AI Analysis Features

### Sentiment Analysis
- **Algorithm**: VADER (Valence Aware Dictionary and sEntiment Reasoner)
- **Output**: Scores from -1.0 (very negative) to 1.0 (very positive)
- **Labels**: positive, negative, neutral

### Misinformation Detection
- **Pattern Recognition**: Keyword-based detection
- **Indicators**:
  - Conspiracy theory language
  - Excessive caps and exclamation marks
  - Urgency indicators without credible sources
  - Suspicious phrases and patterns

### Priority Scoring
- **Algorithm**: Multi-factor scoring system
- **Factors**: Sentiment, misinformation risk, content length
- **Output**: 0.0 to 1.0 (higher = more urgent)

### Community Health Scoring
- **Base Score**: 50/100
- **Positive Impact**: +30 points for positive sentiment
- **Negative Impact**: -30 points for negative sentiment
- **Misinformation Penalty**: -20 points per high-risk post
- **Status Levels**: Excellent (80+), Good (60+), Fair (40+), Poor (<40)

## 🗄️ Database Schema

### Posts Table
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sentiment_score REAL,
    sentiment_label TEXT,
    misinformation_risk REAL,
    category TEXT,
    priority_score REAL
);
```

### Analytics Table
```sql
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    total_posts INTEGER,
    avg_sentiment REAL,
    positive_posts INTEGER,
    negative_posts INTEGER,
    neutral_posts INTEGER,
    misinformation_alerts INTEGER,
    community_health_score REAL
);
```

## 📝 Data Models

### PostCreate
```python
class PostCreate(BaseModel):
    content: str
    author: str
    category: Optional[str] = "general"
```

### PostResponse
```python
class PostResponse(BaseModel):
    id: int
    content: str
    author: str
    timestamp: str
    sentiment_score: float
    sentiment_label: str
    misinformation_risk: float
    category: str
    priority_score: float
```

### AnalyzeRequest
```python
class AnalyzeRequest(BaseModel):
    content: str
    author: Optional[str] = "Anonymous"
```

### HealthResponse
```python
class HealthResponse(BaseModel):
    community_health_score: float
    total_posts: int
    positive_ratio: float
    negative_ratio: float
    misinformation_ratio: float
    health_status: str
    recommendations: List[str]
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: SQLite database path (default: `community_pulse.db`)
- `CORS_ORIGINS`: Allowed CORS origins (default: `["*"]`)

### CORS Settings
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📈 Sample Data

The application includes 20 realistic community posts covering:
- **Positive Feedback**: Amenities, events, maintenance
- **Negative Concerns**: Noise, maintenance issues, complaints
- **Misinformation Examples**: Conspiracy theories, fake news
- **High-Priority Issues**: Security concerns, emergencies

## 🚀 Production Deployment

### Security Considerations
- Implement JWT authentication
- Configure specific CORS origins
- Add rate limiting
- Use environment variables for sensitive data
- Consider using PostgreSQL for production

### Performance Optimization
- Database connection pooling
- Caching with Redis
- Load balancing
- Monitoring and logging

### Docker Production
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Detailed API Docs**: See `API_DOCUMENTATION.md`

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include docstrings for new functions
4. Test new endpoints with the test script
5. Update documentation as needed

## 📄 License

This project is part of the CommunityPulse 48-hour hackathon project.