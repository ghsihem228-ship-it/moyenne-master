@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)
start "" "http://localhost:3000"
node scripts\serve.cjs
pause
