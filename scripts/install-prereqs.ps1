# =====================================================================
#  WealthWise Updater - Installeur des prerequis
# =====================================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$AppRoot = Join-Path $ProjectRoot "app"

function Write-Step { param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}
function Write-OK { param([string]$Message)
    Write-Host "    [OK] $Message" -ForegroundColor Green
}
function Write-Warn { param([string]$Message)
    Write-Host "    [!]  $Message" -ForegroundColor Yellow
}
function Test-CommandExists { param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "  WealthWise Updater - Installation des prerequis" -ForegroundColor Magenta
Write-Host "=================================================================" -ForegroundColor Magenta

# 1. winget
Write-Step "Verification de winget"
if (Test-CommandExists "winget") {
    $wingetVersion = (winget --version) 2>&1
    Write-OK "winget detecte : $wingetVersion"
} else {
    Write-Warn "winget introuvable. Installe App Installer via le Microsoft Store."
    Start-Process "ms-windows-store://pdp/?productid=9NBLGGH4NNS1"
    throw "winget est requis. Relance ce script apres installation."
}

# 2. Node.js LTS
Write-Step "Verification de Node.js"
$needNode = $true
if (Test-CommandExists "node") {
    try {
        $nodeVersion = (node --version).Trim()
        $versionPattern = [regex]"v(\d+)\."
        $m = $versionPattern.Match($nodeVersion)
        if ($m.Success) {
            $major = [int]$m.Groups[1].Value
            if ($major -ge 18) {
                Write-OK "Node.js detecte : $nodeVersion"
                $needNode = $false
            } else {
                Write-Warn "Node.js trop vieux (besoin >= 18)."
            }
        }
    } catch {
        Write-Warn "Impossible de lire la version Node."
    }
}
if ($needNode) {
    Write-Host "    Installation de Node.js LTS via winget..." -ForegroundColor Yellow
    winget install --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    Write-OK "Node.js installe. Ferme PowerShell et relance le script."
    throw "Relance requise apres installation Node."
}

# 3. Rust
Write-Step "Verification de Rust"
$needRust = $true
if (Test-CommandExists "rustc") {
    try {
        $rustVersion = (rustc --version).Trim()
        Write-OK "Rust detecte : $rustVersion"
        $needRust = $false
    } catch {
        Write-Warn "Rust present mais ne repond pas."
    }
}
if ($needRust) {
    Write-Host "    Telechargement de rustup..." -ForegroundColor Yellow
    $rustupPath = Join-Path $env:TEMP "rustup-init.exe"
    Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile $rustupPath -UseBasicParsing
    Write-Host "    Installation de Rust (5-10 min)..." -ForegroundColor Yellow
    Start-Process -FilePath $rustupPath -ArgumentList "-y","--default-toolchain","stable","--profile","minimal" -Wait -NoNewWindow
    Remove-Item $rustupPath -ErrorAction SilentlyContinue
    Write-OK "Rust installe. Ferme PowerShell et relance le script."
    throw "Relance requise apres installation Rust."
}

# 4. MSVC Build Tools
Write-Step "Verification des Visual C++ Build Tools"
$pf86 = ${env:ProgramFiles(x86)}
$vsWhere = Join-Path $pf86 "Microsoft Visual Studio\Installer\vswhere.exe"
$hasBuildTools = $false
if (Test-Path $vsWhere) {
    $vsInstance = & $vsWhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath 2>$null
    if ($vsInstance) {
        Write-OK "Build Tools detectes"
        $hasBuildTools = $true
    }
}
if (-not $hasBuildTools) {
    Write-Warn "Microsoft C++ Build Tools manquants."
    Write-Host "    Installation via winget (environ 2 GB, peut prendre 15-30 min)..." -ForegroundColor Yellow
    winget install --id Microsoft.VisualStudio.2022.BuildTools --silent --accept-source-agreements --accept-package-agreements --override "--quiet --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
    Write-OK "Build Tools installes."
}

# 5. WebView2
Write-Step "Verification de WebView2 Runtime"
$webView2Key = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
if (Test-Path $webView2Key) {
    Write-OK "WebView2 Runtime detecte"
} else {
    Write-Host "    Installation de WebView2 Runtime..." -ForegroundColor Yellow
    winget install --id Microsoft.EdgeWebView2Runtime --silent --accept-source-agreements --accept-package-agreements
    Write-OK "WebView2 installe"
}

# 6. npm install + icones
if (-not (Test-Path $AppRoot)) { throw "Dossier app introuvable : $AppRoot" }
Write-Step "Installation des dependances npm"
Push-Location $AppRoot
try {
    npm install
    Write-OK "Dependances installees"
    $iconsDir = Join-Path $AppRoot "src-tauri\icons"
    $iconIco = Join-Path $iconsDir "icon.ico"
    if (-not (Test-Path $iconIco)) {
        Write-Step "Generation des icones depuis app-icon.svg"
        $svgPath = Join-Path $AppRoot "app-icon.svg"
        if (Test-Path $svgPath) {
            New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
            npx @tauri-apps/cli icon $svgPath
            Write-OK "Icones generees"
        } else {
            Write-Warn "app-icon.svg introuvable, icones non generees."
        }
    } else {
        Write-OK "Icones deja presentes"
    }
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "  Tout est pret. Lance maintenant : .\scripts\run-dev.bat" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
