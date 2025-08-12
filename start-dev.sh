#!/bin/bash

# CommunityPulse Development Startup Script
# Starts both FastAPI backend and React frontend concurrently

set -e  # Exit on any error

echo "🚀 Starting CommunityPulse Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start within expected time${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check Python
if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+${NC}"
    exit 1
fi

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Check if ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"

if port_in_use 8000; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use. Backend may already be running.${NC}"
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use. Frontend may already be running.${NC}"
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}🐍 Starting FastAPI backend...${NC}"
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies if needed
    if [ ! -f "venv/lib/python*/site-packages/fastapi" ]; then
        echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
        pip install -r requirements.txt
    fi
    
    # Download NLTK data if needed
    echo -e "${YELLOW}📦 Checking NLTK data...${NC}"
    python3 -c "import nltk; nltk.download('punkt', quiet=True)" 2>/dev/null || true
    
    # Start backend
    echo -e "${GREEN}🚀 Starting backend on http://localhost:8000${NC}"
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}⚛️  Starting React frontend...${NC}"
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
        npm install
    fi
    
    # Start frontend
    echo -e "${GREEN}🚀 Starting frontend on http://localhost:3000${NC}"
    npm start &
    FRONTEND_PID=$!
    
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"

start_backend
sleep 3

start_frontend
sleep 3

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"

# Wait for backend
if wait_for_service "http://localhost:8000" "Backend API"; then
    echo -e "${GREEN}✅ Backend is running at http://localhost:8000${NC}"
    echo -e "${GREEN}📚 API Documentation: http://localhost:8000/docs${NC}"
else
    echo -e "${RED}❌ Backend failed to start properly${NC}"
    cleanup
fi

# Wait for frontend
if wait_for_service "http://localhost:3000" "Frontend"; then
    echo -e "${GREEN}✅ Frontend is running at http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start properly${NC}"
    cleanup
fi

echo ""
echo -e "${GREEN}🎉 CommunityPulse Development Environment is Ready!${NC}"
echo "=================================================="
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔌 Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:8000/docs"
echo -e "${BLUE}📖 ReDoc:${NC} http://localhost:8000/redoc"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Keep script running
wait