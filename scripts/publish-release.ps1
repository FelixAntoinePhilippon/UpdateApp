# =====================================================================
#  WealthWise Updater - Publication d'une nouvelle release sur GitHub
#  Repo : https://github.com/felixantoinephilippon/UpdateApp
#
#  Ce script :
#  1. Compile l'.exe via make-exe.bat
#  2. Genere/maj le fichier latest.json a la racine du projet
#  3. Affiche les instructions exactes pour publier sur GitHub Desktop
# =====================================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$AppRoot = Join-Path $ProjectRoot "app"

# Recupere la version depuis Cargo.toml
$cargoToml = Get-Content (Join-Path $AppRoot "src-tauri\Cargo.toml") -Raw
if ($cargoToml -match 'version = "([^"]+)"') {
    $version = $matches[1]
} else {
    throw "Impossible de lire la version dans Cargo.toml"
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "  Publication WealthWise Updater v$version" -ForegroundColor Magenta
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ""

# Etape 1 : Compilation
Write-Host "==> Etape 1/3 : Compilation de l'.exe (5-10 min)..." -ForegroundColor Cyan
$makeExe = Join-Path $PSScriptRoot "make-exe.bat"
if (Test-Path $makeExe) {
    & $makeExe
    if ($LASTEXITCODE -ne 0) { throw "Compilation echouee" }
} else {
    throw "scripts\make-exe.bat introuvable"
}

# Etape 2 : Localiser l'.exe
Write-Host ""
Write-Host "==> Etape 2/3 : Localisation de l'.exe..." -ForegroundColor Cyan
$nsisDir = Join-Path $AppRoot "src-tauri\target\release\bundle\nsis"
$exeName = "WealthWise Updater_${version}_x64-setup.exe"
$exePath = Join-Path $nsisDir $exeName

if (-not (Test-Path $exePath)) {
    Write-Host "Recherche d'autres .exe dans $nsisDir ..." -ForegroundColor Yellow
    $exes = Get-ChildItem $nsisDir -Filter "*.exe" -ErrorAction SilentlyContinue
    if ($exes) {
        $exePath = $exes[0].FullName
        $exeName = $exes[0].Name
        Write-Host "Trouve : $exeName" -ForegroundColor Green
    } else {
        throw ".exe introuvable dans $nsisDir"
    }
} else {
    Write-Host "[OK] $exeName" -ForegroundColor Green
}

# Etape 3 : Genere latest.json
Write-Host ""
Write-Host "==> Etape 3/3 : Generation de latest.json..." -ForegroundColor Cyan
$today = Get-Date -Format "yyyy-MM-dd"
$urlEncoded = $exeName -replace ' ', '.'  # GitHub remplace les espaces par des points dans les noms d'asset
$downloadUrl = "https://github.com/felixantoinephilippon/UpdateApp/releases/download/v$version/$urlEncoded"

$notes = Read-Host "Notes de release (en une ligne, ou laisse vide pour defaut)"
if ([string]::IsNullOrWhiteSpace($notes)) {
    $notes = "Nouvelle version $version de WealthWise Updater."
}

$json = @{
    version = $version
    url = $downloadUrl
    notes = $notes
    pub_date = $today
} | ConvertTo-Json -Depth 5

$latestJsonPath = Join-Path $ProjectRoot "latest.json"
$json | Out-File -FilePath $latestJsonPath -Encoding UTF8 -NoNewline

Write-Host "[OK] latest.json mis a jour : $latestJsonPath" -ForegroundColor Green
Write-Host ""
Write-Host "Contenu :" -ForegroundColor Yellow
Get-Content $latestJsonPath | Write-Host

# Instructions finales
Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "  ETAPES A FAIRE MAINTENANT (manuelles)" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Copie le fichier latest.json dans ton repo UpdateApp :" -ForegroundColor White
Write-Host "   - Source : $latestJsonPath" -ForegroundColor Gray
Write-Host "   - Destination : G:\WealthWise\UpdateApp\latest.json (ou ou tu as clone le repo)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Sur GitHub Desktop :" -ForegroundColor White
Write-Host "   - Selectionne le repo UpdateApp" -ForegroundColor Gray
Write-Host "   - Tu verras latest.json dans Changes" -ForegroundColor Gray
Write-Host "   - Commit message : 'Release v$version'" -ForegroundColor Gray
Write-Host "   - Commit + Push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Sur GitHub.com -> ton repo UpdateApp -> Releases :" -ForegroundColor White
Write-Host "   - Clique 'Draft a new release'" -ForegroundColor Gray
Write-Host "   - Tag : v$version" -ForegroundColor Gray
Write-Host "   - Title : WealthWise Updater v$version" -ForegroundColor Gray
Write-Host "   - Description : copie les notes" -ForegroundColor Gray
Write-Host "   - Drag and drop l'.exe : $exePath" -ForegroundColor Gray
Write-Host "   - Clique 'Publish release'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test : dans WealthWise Updater clique 'MAJ app' -> tu verras la nouvelle version" -ForegroundColor White
Write-Host ""

# Ouvre l'Explorateur sur le dossier du .exe pour faciliter le drag and drop
Start-Process explorer.exe $nsisDir

# Ouvre GitHub releases dans le navigateur
Start-Process "https://github.com/felixantoinephilippon/UpdateApp/releases/new"

Write-Host "Appuie sur une touche pour fermer..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
