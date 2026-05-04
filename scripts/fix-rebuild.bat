@echo off
REM =====================================================================
REM  WealthWise Updater - Force un rebuild propre du backend Rust
REM  A utiliser si l'app affiche une vieille version ou si le .bat plante
REM =====================================================================
setlocal
cd /d "%~dp0..\app\src-tauri"

echo.
echo Nettoyage du cache Cargo (supprime le binaire en cache)...
call cargo clean -p wealthwise-updater
echo.
echo Cache nettoye. Maintenant lance scripts\run-dev.bat (ou run-dev-admin.bat)
echo La premiere compilation prendra 1-3 minutes.
echo.
pause
endlocal
