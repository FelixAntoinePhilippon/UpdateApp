@echo off
REM =====================================================================
REM  WealthWise Updater - Lance l'app en mode dev AVEC droits admin
REM  Necessaire pour les MAJ qui modifient Program Files (Bonjour, Edge,
REM  Visual Studio Build Tools, etc.)
REM =====================================================================

REM Verifie si on est deja en admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Demande des droits administrateur...
    powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd /d %~dp0 && run-dev.bat'"
    exit /b
)

REM On est en admin, on lance run-dev
cd /d "%~dp0"
call run-dev.bat
