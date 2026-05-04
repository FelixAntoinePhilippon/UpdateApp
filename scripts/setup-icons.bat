@echo off
REM Genere les icones Tauri depuis app/app-icon.svg
setlocal
cd /d "%~dp0..\app"
echo.
echo Generation des icones depuis app-icon.svg...
call npx @tauri-apps/cli icon app-icon.svg
echo.
echo Icones generees dans src-tauri\icons\
endlocal
pause
