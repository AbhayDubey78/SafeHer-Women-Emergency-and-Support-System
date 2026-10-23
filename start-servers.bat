@echo off
title "SafeHer Servers (Vite & Express)"
cd /d "%~dp0"
echo Starting SafeHer Servers...
call npm run dev:all
pause
