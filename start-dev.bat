@echo off
echo Starting SecurePass Development Environment...
echo.

echo Starting Mock API Server...
start "Mock API Server" cmd /k "node mock-server.js"

echo Waiting for API server to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up...
echo - Mock API Server: http://localhost:4000
echo - Frontend Dev Server: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul

