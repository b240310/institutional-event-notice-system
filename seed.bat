@echo off
echo ========================================================
echo   Seeding Institutional Event & Notice Board Database
echo ========================================================
echo.

cd /d "%~dp0\server"
npm run seed

echo.
pause

