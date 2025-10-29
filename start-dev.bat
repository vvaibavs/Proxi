@echo off
echo Starting Proxi Development Environment...
echo.

echo Starting Backend Server...
cd Server
start cmd /k "npm install && npm run dev"

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Mobile App...
cd ..\BotanIQ
start cmd /k "npm install && npm start"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:3000
echo Mobile App: Check the Expo CLI for the URL
pause
