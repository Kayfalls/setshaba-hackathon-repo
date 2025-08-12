from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
import datetime
from datetime import datetime, timedelta
import random
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

app = FastAPI(
    title="CommunityPulse API",
    description="AI-powered community intelligence platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize sentiment analyzer
sentiment_analyzer = SentimentIntensityAnalyzer()

# Database setup
def init_db():
    conn = sqlite3.connect('community_pulse.db')
    cursor = conn.cursor()
    
    # Create posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            sentiment_score REAL,
            sentiment_label TEXT,
            misinformation_risk REAL,
            category TEXT,
            priority_score REAL
        )
    ''')
    
    # Create analytics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE,
            total_posts INTEGER,
            avg_sentiment REAL,
            positive_posts INTEGER,
            negative_posts INTEGER,
            neutral_posts INTEGER,
            misinformation_alerts INTEGER,
            community_health_score REAL
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Pydantic models
class PostCreate(BaseModel):
    content: str
    author: str
    category: Optional[str] = "general"

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

class AnalyticsResponse(BaseModel):
    total_posts: int
    avg_sentiment: float
    positive_posts: int
    negative_posts: int
    neutral_posts: int
    misinformation_alerts: int
    community_health_score: float
    recent_trends: dict

class AlertResponse(BaseModel):
    id: int
    post_id: int
    alert_type: str
    severity: str
    description: str
    timestamp: str

class DashboardResponse(BaseModel):
    analytics: AnalyticsResponse
    recent_posts: List[PostResponse]
    alerts: List[AlertResponse]
    top_issues: List[dict]

class AnalyzeRequest(BaseModel):
    content: str
    author: Optional[str] = "Anonymous"

class AnalyzeResponse(BaseModel):
    content: str
    author: str
    sentiment_score: float
    sentiment_label: str
    misinformation_risk: float
    priority_score: float
    analysis_timestamp: str

class HealthResponse(BaseModel):
    community_health_score: float
    total_posts: int
    positive_ratio: float
    negative_ratio: float
    misinformation_ratio: float
    health_status: str
    recommendations: List[str]

# AI Analysis Functions
def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment of text using VADER"""
    scores = sentiment_analyzer.polarity_scores(text)
    
    if scores['compound'] >= 0.05:
        label = 'positive'
    elif scores['compound'] <= -0.05:
        label = 'negative'
    else:
        label = 'neutral'
    
    return {
        'score': scores['compound'],
        'label': label,
        'positive': scores['pos'],
        'negative': scores['neg'],
        'neutral': scores['neu']
    }

def detect_misinformation(text: str) -> float:
    """Simple misinformation detection based on keywords and patterns"""
    risk_score = 0.0
    
    # Keywords that might indicate misinformation
    misinformation_keywords = [
        'fake news', 'conspiracy', 'hoax', 'cover up', 'secret cure',
        'government hiding', 'they don\'t want you to know', 'wake up',
        'sheeple', 'mainstream media lies', 'alternative facts'
    ]
    
    # Check for excessive caps (shouting)
    caps_ratio = sum(1 for c in text if c.isupper()) / len(text) if text else 0
    if caps_ratio > 0.3:
        risk_score += 0.2
    
    # Check for misinformation keywords
    text_lower = text.lower()
    for keyword in misinformation_keywords:
        if keyword in text_lower:
            risk_score += 0.3
    
    # Check for excessive exclamation marks
    exclamation_count = text.count('!')
    if exclamation_count > 3:
        risk_score += 0.1
    
    # Check for urgency indicators
    urgency_words = ['urgent', 'immediate', 'now', 'quick', 'fast', 'emergency']
    urgency_count = sum(1 for word in urgency_words if word in text_lower)
    if urgency_count > 2:
        risk_score += 0.1
    
    return min(risk_score, 1.0)

def calculate_priority_score(sentiment_score: float, misinformation_risk: float, content_length: int) -> float:
    """Calculate priority score for post ranking"""
    # Base score from sentiment (negative posts are higher priority)
    base_score = (1 - sentiment_score) * 0.4
    
    # Misinformation risk adds to priority
    risk_score = misinformation_risk * 0.4
    
    # Length factor (longer posts might be more important)
    length_score = min(content_length / 500, 1.0) * 0.2
    
    return base_score + risk_score + length_score

# Generate sample data for demo
def generate_sample_data():
    """Generate realistic sample data for demonstration"""
    sample_posts = [
        "The new pool hours are great! Everyone seems to be enjoying the extended time.",
        "URGENT: There's a conspiracy about the water quality! They're hiding something from us!",
        "The maintenance team did an excellent job fixing the elevator quickly.",
        "Can we please address the noise complaints? Some residents are being very loud late at night.",
        "The community garden is looking beautiful this spring. Great work everyone!",
        "FAKE NEWS: The management is lying about the rent increase! Don't believe their propaganda!",
        "The new security system is working well. I feel much safer now.",
        "There's a suspicious person hanging around the parking lot. Should we report this?",
        "The holiday decorations look amazing! Thank you to everyone who helped.",
        "The garbage collection schedule changed without notice. This is very inconvenient.",
        "The fitness center equipment is in excellent condition. Great job maintaining it!",
        "EMERGENCY: The fire alarm system is broken! This is a safety hazard!",
        "The community events this month were fantastic. Really brought everyone together.",
        "The parking situation is getting worse. We need more spaces.",
        "The landscaping team does such a beautiful job. The flowers are gorgeous!",
        "CONSPIRACY: They're putting chemicals in the air vents to control us!",
        "The package delivery system is working perfectly. Very convenient.",
        "There's a leak in the basement that needs immediate attention.",
        "The community newsletter is very informative. Keep up the good work!",
        "The WiFi speed has improved significantly. Thank you for the upgrade!"
    ]
    
    sample_authors = ["Sarah M.", "John D.", "Maria L.", "David K.", "Lisa R.", "Mike T.", "Emma W.", "Alex P.", "Rachel S.", "Tom B.", "Jennifer H.", "Robert C.", "Amanda F.", "Michael S.", "Jessica L.", "Christopher M.", "Nicole R.", "Daniel P.", "Ashley T.", "Kevin B."]
    
    conn = sqlite3.connect('community_pulse.db')
    cursor = conn.cursor()
    
    # Check if we already have data
    cursor.execute("SELECT COUNT(*) FROM posts")
    if cursor.fetchone()[0] == 0:
        for i, post in enumerate(sample_posts):
            # Generate timestamp within last 7 days
            days_ago = random.randint(0, 7)
            hours_ago = random.randint(0, 23)
            timestamp = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
            
            # Analyze sentiment
            sentiment_result = analyze_sentiment(post)
            
            # Detect misinformation
            misinformation_risk = detect_misinformation(post)
            
            # Calculate priority
            priority_score = calculate_priority_score(
                sentiment_result['score'], 
                misinformation_risk, 
                len(post)
            )
            
            cursor.execute('''
                INSERT INTO posts (content, author, timestamp, sentiment_score, sentiment_label, 
                                 misinformation_risk, category, priority_score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                post, 
                sample_authors[i % len(sample_authors)],
                timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                sentiment_result['score'],
                sentiment_result['label'],
                misinformation_risk,
                random.choice(['general', 'maintenance', 'security', 'amenities', 'noise']),
                priority_score
            ))
    
    conn.commit()
    conn.close()

# Generate sample data on startup
generate_sample_data()

# API Endpoints
@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_content(request: AnalyzeRequest):
    """Real-time content analysis without storing in database"""
    try:
        # Analyze sentiment
        sentiment_result = analyze_sentiment(request.content)
        
        # Detect misinformation
        misinformation_risk = detect_misinformation(request.content)
        
        # Calculate priority score
        priority_score = calculate_priority_score(
            sentiment_result['score'],
            misinformation_risk,
            len(request.content)
        )
        
        return AnalyzeResponse(
            content=request.content,
            author=request.author,
            sentiment_score=sentiment_result['score'],
            sentiment_label=sentiment_result['label'],
            misinformation_risk=misinformation_risk,
            priority_score=priority_score,
            analysis_timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing content: {str(e)}")

@app.get("/api/health", response_model=HealthResponse)
async def get_community_health():
    """Get community health score and recommendations"""
    try:
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        # Get total posts
        cursor.execute("SELECT COUNT(*) FROM posts")
        total_posts = cursor.fetchone()[0]
        
        if total_posts == 0:
            return HealthResponse(
                community_health_score=50.0,
                total_posts=0,
                positive_ratio=0.0,
                negative_ratio=0.0,
                misinformation_ratio=0.0,
                health_status="No data available",
                recommendations=["Start collecting community posts to get health insights"]
            )
        
        # Get sentiment distribution
        cursor.execute("SELECT sentiment_label, COUNT(*) FROM posts GROUP BY sentiment_label")
        sentiment_counts = dict(cursor.fetchall())
        
        positive_posts = sentiment_counts.get('positive', 0)
        negative_posts = sentiment_counts.get('negative', 0)
        
        positive_ratio = positive_posts / total_posts
        negative_ratio = negative_posts / total_posts
        
        # Get misinformation alerts
        cursor.execute("SELECT COUNT(*) FROM posts WHERE misinformation_risk > 0.5")
        misinformation_alerts = cursor.fetchone()[0]
        misinformation_ratio = misinformation_alerts / total_posts
        
        # Calculate community health score (0-100)
        health_score = 50.0  # Base score
        
        # Adjust based on sentiment
        health_score += (positive_ratio - negative_ratio) * 30
        
        # Penalize for misinformation
        health_score -= misinformation_ratio * 20
        
        health_score = max(0, min(100, health_score))
        
        # Determine health status
        if health_score >= 80:
            health_status = "Excellent"
            recommendations = [
                "Maintain current community engagement strategies",
                "Continue monitoring for any emerging issues",
                "Consider expanding positive community initiatives"
            ]
        elif health_score >= 60:
            health_status = "Good"
            recommendations = [
                "Address negative sentiment issues proactively",
                "Increase positive community engagement activities",
                "Monitor misinformation trends closely"
            ]
        elif health_score >= 40:
            health_status = "Fair"
            recommendations = [
                "Implement immediate community improvement initiatives",
                "Address high-priority concerns promptly",
                "Consider community feedback sessions"
            ]
        else:
            health_status = "Poor"
            recommendations = [
                "Urgent action required for community health",
                "Implement comprehensive community improvement plan",
                "Address all high-priority issues immediately",
                "Consider external community management support"
            ]
        
        conn.close()
        
        return HealthResponse(
            community_health_score=round(health_score, 1),
            total_posts=total_posts,
            positive_ratio=round(positive_ratio, 3),
            negative_ratio=round(negative_ratio, 3),
            misinformation_ratio=round(misinformation_ratio, 3),
            health_status=health_status,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving community health: {str(e)}")

@app.post("/api/posts", response_model=PostResponse)
async def create_post(post: PostCreate):
    """Submit a new community post for analysis"""
    try:
        # Analyze sentiment
        sentiment_result = analyze_sentiment(post.content)
        
        # Detect misinformation
        misinformation_risk = detect_misinformation(post.content)
        
        # Calculate priority score
        priority_score = calculate_priority_score(
            sentiment_result['score'],
            misinformation_risk,
            len(post.content)
        )
        
        # Store in database
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO posts (content, author, sentiment_score, sentiment_label, 
                             misinformation_risk, category, priority_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            post.content,
            post.author,
            sentiment_result['score'],
            sentiment_result['label'],
            misinformation_risk,
            post.category,
            priority_score
        ))
        
        post_id = cursor.lastrowid
        
        # Get the created post
        cursor.execute('SELECT * FROM posts WHERE id = ?', (post_id,))
        row = cursor.fetchone()
        
        conn.commit()
        conn.close()
        
        return PostResponse(
            id=row[0],
            content=row[1],
            author=row[2],
            timestamp=row[3],
            sentiment_score=row[4],
            sentiment_label=row[5],
            misinformation_risk=row[6],
            category=row[7],
            priority_score=row[8]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing post: {str(e)}")

@app.get("/api/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Get community health analytics"""
    try:
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        # Get total posts
        cursor.execute("SELECT COUNT(*) FROM posts")
        total_posts = cursor.fetchone()[0]
        
        # Get sentiment distribution
        cursor.execute("SELECT sentiment_label, COUNT(*) FROM posts GROUP BY sentiment_label")
        sentiment_counts = dict(cursor.fetchall())
        
        positive_posts = sentiment_counts.get('positive', 0)
        negative_posts = sentiment_counts.get('negative', 0)
        neutral_posts = sentiment_counts.get('neutral', 0)
        
        # Get average sentiment
        cursor.execute("SELECT AVG(sentiment_score) FROM posts")
        avg_sentiment = cursor.fetchone()[0] or 0.0
        
        # Get misinformation alerts
        cursor.execute("SELECT COUNT(*) FROM posts WHERE misinformation_risk > 0.5")
        misinformation_alerts = cursor.fetchone()[0]
        
        # Calculate community health score (0-100)
        health_score = 50.0  # Base score
        
        # Adjust based on sentiment
        if total_posts > 0:
            positive_ratio = positive_posts / total_posts
            negative_ratio = negative_posts / total_posts
            health_score += (positive_ratio - negative_ratio) * 30
        
        # Penalize for misinformation
        if total_posts > 0:
            misinformation_ratio = misinformation_alerts / total_posts
            health_score -= misinformation_ratio * 20
        
        health_score = max(0, min(100, health_score))
        
        # Get recent trends (last 7 days)
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        cursor.execute("""
            SELECT DATE(timestamp) as date, COUNT(*), AVG(sentiment_score)
            FROM posts 
            WHERE timestamp >= ?
            GROUP BY DATE(timestamp)
            ORDER BY date
        """, (week_ago,))
        
        trends = cursor.fetchall()
        recent_trends = {
            'daily_posts': [{'date': row[0], 'count': row[1], 'avg_sentiment': row[2]} for row in trends]
        }
        
        conn.close()
        
        return AnalyticsResponse(
            total_posts=total_posts,
            avg_sentiment=round(avg_sentiment, 3),
            positive_posts=positive_posts,
            negative_posts=negative_posts,
            neutral_posts=neutral_posts,
            misinformation_alerts=misinformation_alerts,
            community_health_score=round(health_score, 1),
            recent_trends=recent_trends
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving analytics: {str(e)}")

@app.get("/api/alerts", response_model=List[AlertResponse])
async def get_alerts():
    """Get misinformation and high-priority alerts"""
    try:
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        # Get posts with high misinformation risk or high priority
        cursor.execute("""
            SELECT id, content, misinformation_risk, priority_score, timestamp
            FROM posts 
            WHERE misinformation_risk > 0.3 OR priority_score > 0.7
            ORDER BY priority_score DESC, misinformation_risk DESC
            LIMIT 10
        """)
        
        alerts = []
        for row in cursor.fetchall():
            post_id, content, misinformation_risk, priority_score, timestamp = row
            
            if misinformation_risk > 0.5:
                alert_type = "misinformation"
                severity = "high" if misinformation_risk > 0.7 else "medium"
                description = f"Potential misinformation detected in post by {content[:50]}..."
            else:
                alert_type = "high_priority"
                severity = "high" if priority_score > 0.8 else "medium"
                description = f"High priority community concern: {content[:50]}..."
            
            alerts.append(AlertResponse(
                id=len(alerts) + 1,
                post_id=post_id,
                alert_type=alert_type,
                severity=severity,
                description=description,
                timestamp=timestamp
            ))
        
        conn.close()
        return alerts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving alerts: {str(e)}")

@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard():
    """Get comprehensive dashboard data"""
    try:
        # Get analytics
        analytics = await get_analytics()
        
        # Get recent posts
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, content, author, timestamp, sentiment_score, sentiment_label, 
                   misinformation_risk, category, priority_score
            FROM posts 
            ORDER BY timestamp DESC 
            LIMIT 10
        """)
        
        recent_posts = []
        for row in cursor.fetchall():
            recent_posts.append(PostResponse(
                id=row[0],
                content=row[1],
                author=row[2],
                timestamp=row[3],
                sentiment_score=row[4],
                sentiment_label=row[5],
                misinformation_risk=row[6],
                category=row[7],
                priority_score=row[8]
            ))
        
        # Get alerts
        alerts = await get_alerts()
        
        # Get top issues by category
        cursor.execute("""
            SELECT category, COUNT(*) as count, AVG(sentiment_score) as avg_sentiment
            FROM posts 
            GROUP BY category 
            ORDER BY count DESC
        """)
        
        top_issues = []
        for row in cursor.fetchall():
            category, count, avg_sentiment = row
            top_issues.append({
                'category': category,
                'count': count,
                'avg_sentiment': round(avg_sentiment, 3) if avg_sentiment else 0.0
            })
        
        conn.close()
        
        return DashboardResponse(
            analytics=analytics,
            recent_posts=recent_posts,
            alerts=alerts,
            top_issues=top_issues
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving dashboard: {str(e)}")

@app.get("/api/posts", response_model=List[PostResponse])
async def get_posts(limit: int = 20, offset: int = 0):
    """Get paginated list of posts"""
    try:
        conn = sqlite3.connect('community_pulse.db')
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, content, author, timestamp, sentiment_score, sentiment_label, 
                   misinformation_risk, category, priority_score
            FROM posts 
            ORDER BY timestamp DESC 
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        posts = []
        for row in cursor.fetchall():
            posts.append(PostResponse(
                id=row[0],
                content=row[1],
                author=row[2],
                timestamp=row[3],
                sentiment_score=row[4],
                sentiment_label=row[5],
                misinformation_risk=row[6],
                category=row[7],
                priority_score=row[8]
            ))
        
        conn.close()
        return posts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving posts: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)