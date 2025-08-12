# CommunityPulse API Documentation

## Overview

CommunityPulse is an AI-powered community intelligence platform that analyzes community communications, detects misinformation, and provides actionable insights to property managers and community leaders.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication for demo purposes. In production, JWT authentication should be implemented.

## Endpoints

### 1. Health Check

**GET /**  
Returns basic API information and available endpoints.

**Response:**
```json
{
  "message": "CommunityPulse API is running!",
  "version": "1.0.0",
  "endpoints": {
    "POST /api/posts": "Submit community posts for analysis",
    "GET /api/posts": "Retrieve analyzed posts with sentiment scores",
    "POST /api/analyze": "Real-time content analysis",
    "GET /api/dashboard": "Community intelligence metrics",
    "GET /api/health": "Community health score",
    "GET /api/analytics": "Get community analytics",
    "GET /api/alerts": "Get alerts"
  }
}
```

### 2. Submit Community Post

**POST /api/posts**  
Submit a new community post for AI analysis and storage.

**Request Body:**
```json
{
  "content": "The new pool hours are great! Everyone seems to be enjoying the extended time.",
  "author": "Sarah M.",
  "category": "amenities"
}
```

**Response:**
```json
{
  "id": 1,
  "content": "The new pool hours are great! Everyone seems to be enjoying the extended time.",
  "author": "Sarah M.",
  "timestamp": "2024-01-07 14:30:00",
  "sentiment_score": 0.8,
  "sentiment_label": "positive",
  "misinformation_risk": 0.1,
  "category": "amenities",
  "priority_score": 0.2
}
```

### 3. Retrieve Posts

**GET /api/posts**  
Retrieve analyzed posts with sentiment scores and pagination.

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 20)
- `offset` (optional): Number of posts to skip (default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "content": "The new pool hours are great!",
    "author": "Sarah M.",
    "timestamp": "2024-01-07 14:30:00",
    "sentiment_score": 0.8,
    "sentiment_label": "positive",
    "misinformation_risk": 0.1,
    "category": "amenities",
    "priority_score": 0.2
  }
]
```

### 4. Real-time Content Analysis

**POST /api/analyze**  
Analyze content in real-time without storing in the database.

**Request Body:**
```json
{
  "content": "This is a test post for analysis",
  "author": "Anonymous"
}
```

**Response:**
```json
{
  "content": "This is a test post for analysis",
  "author": "Anonymous",
  "sentiment_score": 0.0,
  "sentiment_label": "neutral",
  "misinformation_risk": 0.0,
  "priority_score": 0.5,
  "analysis_timestamp": "2024-01-07T14:30:00.123456"
}
```

### 5. Community Health Score

**GET /api/health**  
Get comprehensive community health metrics and recommendations.

**Response:**
```json
{
  "community_health_score": 78.5,
  "total_posts": 1247,
  "positive_ratio": 0.366,
  "negative_ratio": 0.188,
  "misinformation_ratio": 0.010,
  "health_status": "Good",
  "recommendations": [
    "Address negative sentiment issues proactively",
    "Increase positive community engagement activities",
    "Monitor misinformation trends closely"
  ]
}
```

### 6. Dashboard Data

**GET /api/dashboard**  
Get comprehensive dashboard data including analytics, recent posts, alerts, and top issues.

**Response:**
```json
{
  "analytics": {
    "total_posts": 1247,
    "avg_sentiment": 0.23,
    "positive_posts": 456,
    "negative_posts": 234,
    "neutral_posts": 557,
    "misinformation_alerts": 12,
    "community_health_score": 78.5,
    "recent_trends": {
      "daily_posts": [
        {
          "date": "2024-01-01",
          "count": 45,
          "avg_sentiment": 0.3
        }
      ]
    }
  },
  "recent_posts": [...],
  "alerts": [...],
  "top_issues": [
    {
      "category": "maintenance",
      "count": 156,
      "avg_sentiment": -0.2
    }
  ]
}
```

### 7. Analytics

**GET /api/analytics**  
Get detailed community analytics and metrics.

**Response:**
```json
{
  "total_posts": 1247,
  "avg_sentiment": 0.23,
  "positive_posts": 456,
  "negative_posts": 234,
  "neutral_posts": 557,
  "misinformation_alerts": 12,
  "community_health_score": 78.5,
  "recent_trends": {
    "daily_posts": [...]
  }
}
```

### 8. Alerts

**GET /api/alerts**  
Get misinformation and high-priority alerts.

**Response:**
```json
[
  {
    "id": 1,
    "post_id": 2,
    "alert_type": "misinformation",
    "severity": "high",
    "description": "Potential misinformation detected in post by John D.",
    "timestamp": "2024-01-07 13:15:00"
  }
]
```

## Data Models

### PostCreate
```json
{
  "content": "string (required)",
  "author": "string (required)",
  "category": "string (optional, default: 'general')"
}
```

### PostResponse
```json
{
  "id": "integer",
  "content": "string",
  "author": "string",
  "timestamp": "string (datetime)",
  "sentiment_score": "float (-1.0 to 1.0)",
  "sentiment_label": "string (positive|negative|neutral)",
  "misinformation_risk": "float (0.0 to 1.0)",
  "category": "string",
  "priority_score": "float (0.0 to 1.0)"
}
```

### AnalyzeRequest
```json
{
  "content": "string (required)",
  "author": "string (optional, default: 'Anonymous')"
}
```

### AnalyzeResponse
```json
{
  "content": "string",
  "author": "string",
  "sentiment_score": "float",
  "sentiment_label": "string",
  "misinformation_risk": "float",
  "priority_score": "float",
  "analysis_timestamp": "string (ISO datetime)"
}
```

### HealthResponse
```json
{
  "community_health_score": "float (0-100)",
  "total_posts": "integer",
  "positive_ratio": "float (0-1)",
  "negative_ratio": "float (0-1)",
  "misinformation_ratio": "float (0-1)",
  "health_status": "string",
  "recommendations": ["string"]
}
```

## AI Analysis Features

### Sentiment Analysis
- Uses VADER (Valence Aware Dictionary and sEntiment Reasoner) algorithm
- Returns scores from -1.0 (very negative) to 1.0 (very positive)
- Labels: positive, negative, neutral

### Misinformation Detection
- Keyword-based pattern recognition
- Checks for conspiracy theory language
- Analyzes excessive caps and exclamation marks
- Identifies urgency indicators without credible sources

### Priority Scoring
- Combines sentiment, misinformation risk, and content length
- Higher scores indicate more urgent issues
- Used for alert generation and issue prioritization

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (validation errors)
- **500**: Internal Server Error

Error responses include a detail message:
```json
{
  "detail": "Error message description"
}
```

## Rate Limiting

Currently not implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

CORS is enabled for all origins to support frontend development. In production, configure specific allowed origins.

## Database

The application uses SQLite for simplicity. In production, consider using PostgreSQL or MySQL for better performance and scalability.

## Sample Data

The application includes realistic sample data for demonstration:
- 20 community posts with varying sentiment
- Multiple authors and categories
- Examples of misinformation and high-priority content
- Realistic timestamps and analysis results

## Development

### Running the API
```bash
cd backend
uvicorn main:app --reload
```

### Interactive Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Testing
Use the interactive documentation or tools like curl/Postman to test endpoints.

Example curl command:
```bash
curl -X POST "http://localhost:8000/api/posts" \
     -H "Content-Type: application/json" \
     -d '{"content": "Test post", "author": "Test User", "category": "general"}'
```