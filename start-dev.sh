#!/bin/bash

echo "Starting SecurePass Development Environment..."
echo

echo "Starting Mock API Server..."
node mock-server.js &
API_PID=$!

echo "Waiting for API server to start..."
sleep 3

echo "Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are running:"
echo "- Mock API Server: http://localhost:4000"
echo "- Frontend Dev Server: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for both processes
wait

