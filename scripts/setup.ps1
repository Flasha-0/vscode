param(
  [switch]$Quick,
  [switch]$Help
)

$ErrorActionPreference = "Stop"
$FlashaDir = Split-Path -Parent $PSScriptRoot

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

if ($Help) {
  Write-Host @"
Flasha Code Setup Script
------------------------
Usage: .\scripts\setup.ps1 [options]

Options:
  -Quick   Only compile the extension (skip full VS Code build)
  -Help    Show this help

Steps:
  1. Check prerequisites (Node.js, yarn)
  2. Install dependencies
  3. Compile TypeScript
  4. Done!
"@
  exit 0
}

Write-Step "Checking prerequisites..."
$nodeVer = (node --version 2>$null)
if (-not $nodeVer) { Write-Error "Node.js is required. Install from https://nodejs.org (v22.x)"; exit 1 }
Write-Host "  Node.js $nodeVer"

$yarnVer = (yarn --version 2>$null)
if (-not $yarnVer) { Write-Error "yarn is required. Install with: npm install -g yarn"; exit 1 }
Write-Host "  yarn $yarnVer"

if ($Quick) {
  Write-Step "Quick mode: Building Flasha extension only..."
  Set-Location "$FlashaDir\extensions\flasha-code"
  npm install
  npx tsc -b tsconfig.json
  Write-Host "  Flasha extension compiled to dist/" -ForegroundColor Green
} else {
  Write-Step "Installing VS Code dependencies..."
  Set-Location $FlashaDir
  yarn install --frozen-lockfile

  Write-Step "Compiling VS Code + Flasha extension..."
  yarn compile

  Write-Step "Setup complete! Run 'yarn start' to launch Flasha Code"
}

Write-Host @"

  Flasha Code is ready!
  ----------------------
  Repo: $FlashaDir
"@ -ForegroundColor Green
