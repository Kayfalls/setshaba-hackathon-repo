# Requirements.txt Explanation

This document explains each dependency in the `requirements.txt` file and its purpose in the CommunityPulse FastAPI platform.

## 🚀 Core Framework

### FastAPI and Uvicorn
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
```
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **Uvicorn**: ASGI server for running FastAPI applications
- **Purpose**: Core web framework and server for the API

## 🗄️ Database

### SQLAlchemy
```txt
sqlalchemy==2.0.23
sqlite3  # Built-in with Python
```
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library
- **SQLite3**: Lightweight, file-based database (built into Python)
- **Purpose**: Database abstraction layer and local data storage

## 🤖 AI/ML Libraries

### Natural Language Processing
```txt
nltk==3.8.1
vaderSentiment==3.3.2
```
- **NLTK**: Natural Language Toolkit for text processing
- **VADER**: Valence Aware Dictionary and sEntiment Reasoner for sentiment analysis
- **Purpose**: Text analysis and sentiment detection

### Machine Learning
```txt
scikit-learn==1.3.2
pandas==2.1.4
numpy==1.25.2
```
- **Scikit-learn**: Machine learning library for predictive modeling
- **Pandas**: Data manipulation and analysis library
- **NumPy**: Numerical computing library
- **Purpose**: Data processing, analysis, and ML model development

## 📝 Data Validation

### Pydantic
```txt
pydantic==2.5.0
pydantic-settings==2.1.0
```
- **Pydantic**: Data validation using Python type annotations
- **Pydantic-settings**: Settings management using Pydantic
- **Purpose**: Request/response validation and configuration management

## 🌐 HTTP and API Utilities

### HTTP Libraries
```txt
python-multipart==0.0.6
requests==2.31.0
httpx==0.25.2
```
- **python-multipart**: File upload handling for FastAPI
- **requests**: HTTP library for making API calls
- **httpx**: Modern HTTP client for async operations
- **Purpose**: File uploads, external API calls, and HTTP client functionality

## 🔒 Security and Authentication

### JWT and Password Handling
```txt
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
```
- **python-jose**: JSON Web Token (JWT) implementation
- **passlib**: Password hashing library with bcrypt support
- **python-dotenv**: Environment variable management
- **Purpose**: JWT authentication, secure password handling, and configuration

## 🔧 Middleware and Utilities

### CORS and File Handling
```txt
fastapi-cors==0.0.6
aiofiles==23.2.1
python-dateutil==2.8.2
```
- **fastapi-cors**: Cross-Origin Resource Sharing middleware
- **aiofiles**: Asynchronous file operations
- **python-dateutil**: Date and time utilities
- **Purpose**: CORS support, file operations, and date/time handling

## 🧪 Development and Testing

### Testing Framework
```txt
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
```
- **pytest**: Testing framework for Python
- **pytest-asyncio**: Async support for pytest
- **pytest-cov**: Coverage reporting for tests
- **Purpose**: Unit testing, integration testing, and code coverage

## 🚀 Production Deployment

### Production Server
```txt
gunicorn==21.2.0
```
- **Gunicorn**: WSGI HTTP Server for production deployment
- **Purpose**: Production-grade server for deployment

## 📦 Installation Instructions

### Basic Installation
```bash
pip install -r requirements.txt
```

### Development Installation
```bash
# Install with development dependencies
pip install -r requirements.txt

# Install in development mode
pip install -e .
```

### Production Installation
```bash
# Install only production dependencies
pip install fastapi uvicorn sqlalchemy nltk vaderSentiment scikit-learn pandas numpy pydantic python-multipart python-jose passlib python-dotenv aiofiles python-dateutil gunicorn
```

## 🔧 Version Management

### Why These Versions?
- **FastAPI 0.104.1**: Latest stable version with all features
- **SQLAlchemy 2.0.23**: Modern ORM with async support
- **NLTK 3.8.1**: Latest version with all required data
- **VADER 3.3.2**: Stable sentiment analysis library
- **Scikit-learn 1.3.2**: Latest stable ML library
- **Pydantic 2.5.0**: Latest version with performance improvements

## 🚨 Security Considerations

### Critical Dependencies
- **python-jose**: Used for JWT token handling
- **passlib**: Used for password hashing
- **python-dotenv**: Used for environment variable management

### Update Strategy
- Regularly update security-critical packages
- Test thoroughly after updates
- Use `pip-audit` to check for vulnerabilities

## 📊 Dependency Categories

| Category | Packages | Purpose |
|----------|----------|---------|
| **Core Framework** | fastapi, uvicorn | Web framework and server |
| **Database** | sqlalchemy | ORM and database abstraction |
| **AI/ML** | nltk, vaderSentiment, scikit-learn, pandas, numpy | Text analysis and ML |
| **Validation** | pydantic, pydantic-settings | Data validation and config |
| **HTTP** | python-multipart, requests, httpx | File uploads and HTTP clients |
| **Security** | python-jose, passlib, python-dotenv | Authentication and security |
| **Utilities** | fastapi-cors, aiofiles, python-dateutil | CORS, files, and dates |
| **Testing** | pytest, pytest-asyncio, pytest-cov | Testing and coverage |
| **Production** | gunicorn | Production server |

## 🔄 Alternative Dependencies

### For Different Use Cases

**PostgreSQL instead of SQLite:**
```txt
psycopg2-binary==2.9.7  # PostgreSQL adapter
```

**Redis for caching:**
```txt
redis==5.0.1  # Redis client
```

**Celery for background tasks:**
```txt
celery==5.3.4  # Task queue
```

**Prometheus for monitoring:**
```txt
prometheus-client==0.19.0  # Metrics collection
```

## 📈 Performance Considerations

### Heavy Dependencies
- **NLTK**: Large library, consider lazy loading
- **Scikit-learn**: Heavy ML library, load models on demand
- **Pandas**: Memory-intensive for large datasets

### Optimization Tips
- Use async operations where possible
- Implement caching for expensive operations
- Consider using lighter alternatives for simple tasks
- Profile memory usage in production

## 🛠 Troubleshooting

### Common Issues

**NLTK Data Missing:**
```python
import nltk
nltk.download('punkt')
nltk.download('vader_lexicon')
```

**SQLAlchemy Warnings:**
```python
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
```

**CORS Issues:**
```python
# Ensure CORS middleware is properly configured
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [NLTK Documentation](https://www.nltk.org/)
- [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)