@echo off
setlocal enabledelayedexpansion

REM CommunityPulse Development Startup Script for Windows
REM Starts both FastAPI backend and React frontend concurrently

echo 🚀 Starting CommunityPulse Development Environment
echo ==================================================

REM Check prerequisites
echo 🔍 Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Check if ports are available
echo 🔍 Checking port availability...

netstat -an | findstr ":8000" >nul
if not errorlevel 1 (
    echo ⚠️  Port 8000 is already in use. Backend may already be running.
)

netstat -an | findstr ":3000" >nul
if not errorlevel 1 (
    echo ⚠️  Port 3000 is already in use. Frontend may already be running.
)

REM Start backend
echo 🐍 Starting FastAPI backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\Lib\site-packages\fastapi" (
    echo 📦 Installing Python dependencies...
    pip install -r requirements.txt
)

REM Download NLTK data if needed
echo 📦 Checking NLTK data...
python -c "import nltk; nltk.download('punkt', quiet=True)" 2>nul

REM Start backend
echo 🚀 Starting backend on http://localhost:8000
start "CommunityPulse Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo ⚛️  Starting React frontend...
cd frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

REM Start frontend
echo 🚀 Starting frontend on http://localhost:3000
start "CommunityPulse Frontend" cmd /k "npm start"

cd ..

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo 🎉 CommunityPulse Development Environment is Starting!
echo ==================================================
echo 📱 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 📖 ReDoc: http://localhost:8000/redoc
echo.
echo Services are starting in separate windows.
echo Close those windows to stop the services.
echo.
pause