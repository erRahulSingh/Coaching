@echo off
echo ====================================================
echo Starting JMS Modern Classes ^& Library Dev Servers...
echo ====================================================
echo.

set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"

echo Launching Express Backend Server (Port 5000)...
start "JMS Backend Server" cmd /k "cd /d "%BASE_DIR%backend" && npm run dev"

echo Launching Next.js Frontend Server (Port 3000)...
start "JMS Frontend Server" cmd /k "cd /d "%BASE_DIR%frontend" && npm run dev"

echo.
echo ====================================================
echo Process launched!
echo - Next.js Frontend: http://localhost:3000
echo - Express Backend:  http://localhost:5000
echo.
echo Check the new terminal windows for live server logs.
echo ====================================================
pause
