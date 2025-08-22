#!/bin/bash
# Render build script for Echoes Chat App

echo "🚀 Starting Echoes build process..."

# Set build environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install --prefix backend --only=production

echo "📦 Installing frontend dependencies..." 
npm install --prefix frontend

# Build frontend
echo "🏗️  Building frontend..."
npm run build --prefix frontend

# Verify build
if [ -d "./frontend/dist" ]; then
    echo "✅ Frontend build successful"
    echo "📊 Build size:"
    du -sh ./frontend/dist
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Verify backend dependencies
if [ -d "./backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing"
    exit 1
fi

echo "🎉 Build process completed successfully!"
