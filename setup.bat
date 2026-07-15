@echo off
echo ====================================================
echo JMS Modern Classes ^& Library - System Installer
echo ====================================================
echo.

:: Get current folder path
set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"

echo [1/2] Installing Next.js frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error installing frontend dependencies.
    goto error
)

echo.
echo [2/2] Installing Node.js backend dependencies...
cd /d "%BASE_DIR%"
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error installing backend dependencies.
    goto error
)

echo.
echo ====================================================
echo Installation Complete!
echo Press any key to exit setup, then run 'run-dev.bat'
echo ====================================================
cd /d "%BASE_DIR%"
pause
exit /b 0

:error
echo.
echo Installation failed! Please check npm issues.
cd /d "%BASE_DIR%"
pause
exit /b 1
