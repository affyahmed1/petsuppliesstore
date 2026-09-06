# ============================================================================
# KIN & TAIL — Shopify theme export (Windows / PowerShell)
#
# Pushes the contents of ./shopify-theme/ to the ROOT of
#   https://github.com/affyahmed1/kin-and-tail-theme   (branch: main)
#
# Usage (from the project root):
#   powershell -ExecutionPolicy Bypass -File .\export-theme.ps1
#
# Auth: uses your local git credentials (gh auth login or an HTTPS token).
# Prefer SSH?  $env:REPO_URL = "git@github.com:affyahmed1/kin-and-tail-theme.git"
# ============================================================================
$ErrorActionPreference = "Stop"

$Branch  = "main"
$RepoUrl = if ($env:REPO_URL) { $env:REPO_URL } else { "https://github.com/affyahmed1/kin-and-tail-theme.git" }
$Root    = $PSScriptRoot
$Src     = Join-Path $Root "shopify-theme"

# --- 1. Preflight -------------------------------------------------------------
$required = @("assets", "config", "layout", "locales", "sections", "snippets", "templates", "README.md")
foreach ($item in $required) {
    if (-not (Test-Path (Join-Path $Src $item))) {
        throw "Preflight failed: $Src\$item is missing"
    }
}
Write-Host "Preflight passed - theme structure valid"

# --- 2. Stage ONLY the theme contents ------------------------------------------
$Stage = Join-Path ([System.IO.Path]::GetTempPath()) ("kt-theme-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $Stage | Out-Null
Copy-Item -Path (Join-Path $Src "*") -Destination $Stage -Recurse -Force
Remove-Item -Recurse -Force (Join-Path $Stage ".git") -ErrorAction SilentlyContinue

# --- 3. Init, commit, push ------------------------------------------------------
Push-Location $Stage
try {
    git init -b $Branch -q
    # Ensure a commit identity exists (repo-local only — never touches your global Git settings)
    if (-not (git config user.email)) { git config user.email "affyahmed1@users.noreply.github.com" }
    if (-not (git config user.name))  { git config user.name  "affyahmed1" }
    git add -A
    git commit -q -m "Kin & Tail — Shopify Online Store 2.0 theme (initial import)"
    git remote add origin $RepoUrl
    git push -u origin $Branch

    Write-Host ""
    Write-Host "Pushed to $RepoUrl"
    Write-Host "  Branch : $Branch"
    Write-Host "  Root   : assets/ config/ layout/ locales/ sections/ snippets/ templates/ + README.md"
    Write-Host ""
    Write-Host "Next: Shopify Admin -> Online Store -> Themes -> Add theme -> Connect from GitHub"
}
finally {
    Pop-Location
    Remove-Item -Recurse -Force $Stage -ErrorAction SilentlyContinue
}
