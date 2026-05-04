@echo off
REM =====================================================================
REM  WealthWise Updater - Compile un .exe distribuable
REM  Resultat dans : app\src-tauri\target\release\bundle\
REM =====================================================================
setlocal
cd /d "%~dp0..\app"
echo.
echo Compilation de WealthWise Updater (release)...
echo Cela peut prendre 10-15 minutes la premiere fois.
echo.
call npm run tauri:build
echo.
echo Build termine. Cherche le .exe dans :
echo   app\src-tauri\target\release\bundle\nsis\
echo   app\src-tauri\target\release\bundle\msi\
endlocal
pause
