@echo off
echo ========================================================
echo   Starting Institutional Event & Notice Board System
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Launching Backend Server on http://localhost:5000 ...
start "CampusConnect - Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo 2. Launching Frontend Server on http://localhost:5173 ...
start "CampusConnect - Frontend" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo 3. Opening Application in your Browser...
start http://localhost:5173

echo.
echo ========================================================
echo   Application Started!
echo   Demo Login:
echo   - Admin:   admin@institution.edu    / Password@123
echo   - Faculty: prof.sharma@institution.edu / Password@123
echo   - Student: aravind@student.edu      / Password@123
echo ========================================================
pause

