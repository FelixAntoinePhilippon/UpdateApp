@echo off
REM =====================================================================
REM  WealthWise Updater - Compile un .exe standalone distribuable
REM  Resultat : un .exe que tu peux lancer en double-cliquant
REM =====================================================================
setlocal
cd /d "%~dp0..\app"

echo.
echo =================================================================
echo   COMPILATION DU .EXE STANDALONE
echo =================================================================
echo.
echo Etape 1/2 : Compilation du frontend React...
call npm run build
if errorlevel 1 goto :error

echo.
echo Etape 2/2 : Compilation du backend Rust + bundle .exe
echo (peut prendre 5-15 min la premiere fois)
echo.
call npx @tauri-apps/cli build
if errorlevel 1 goto :error

echo.
echo =================================================================
echo   SUCCES ! Voici tes fichiers :
echo =================================================================
echo.
echo Installeur (recommande, double-clic pour installer) :
dir /b "src-tauri\target\release\bundle\nsis\*.exe" 2>nul
echo   Chemin complet : %cd%\src-tauri\target\release\bundle\nsis\
echo.
echo Installeur MSI (alternatif) :
dir /b "src-tauri\target\release\bundle\msi\*.msi" 2>nul
echo   Chemin complet : %cd%\src-tauri\target\release\bundle\msi\
echo.
echo Binaire direct (sans installation, juste l'exe) :
echo   %cd%\src-tauri\target\release\wealthwise-updater.exe
echo.

REM Ouvre le dossier du resultat dans l'Explorateur
start "" "%cd%\src-tauri\target\release\bundle\nsis"

goto :end

:error
echo.
echo =================================================================
echo   ECHEC DE LA COMPILATION
echo =================================================================
echo.
echo Verifie que Rust et Node sont installes (lance install-prereqs.ps1).
echo.
pause
exit /b 1

:end
echo Appuie sur une touche pour fermer...
pause >nul
endlocal
