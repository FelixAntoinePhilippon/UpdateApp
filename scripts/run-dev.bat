@echo off
REM =====================================================================
REM  WealthWise Updater - Lance l'app en mode developpement
REM =====================================================================
setlocal
cd /d "%~dp0..\app"
echo.
echo Demarrage de WealthWise Updater (mode dev)...
echo.
call npm run tauri:dev
endlocal
