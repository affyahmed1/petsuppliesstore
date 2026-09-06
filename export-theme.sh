#!/usr/bin/env bash
# ============================================================================
# KIN & TAIL — Shopify theme export
#
# Pushes the contents of ./shopify-theme/ to the ROOT of
#   https://github.com/affyahmed1/kin-and-tail-theme   (branch: main)
#
# The original React/Vite project is never touched and never pushed.
#
# Usage (from the project root):
#   chmod +x export-theme.sh
#   ./export-theme.sh
#
# Auth: uses your local git credentials. Either
#   gh auth login                                    (GitHub CLI), or
#   an HTTPS personal access token, or
#   REPO_URL=git@github.com:affyahmed1/kin-and-tail-theme.git ./export-theme.sh
# ============================================================================
set -euo pipefail

BRANCH="main"
REPO_URL="${REPO_URL:-https://github.com/affyahmed1/kin-and-tail-theme.git}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$ROOT/shopify-theme"

# --- 1. Preflight: the theme must be complete -------------------------------
required=(assets config layout locales sections snippets templates README.md)
for item in "${required[@]}"; do
  if [ ! -e "$SRC/$item" ]; then
    echo "✗ Preflight failed: $SRC/$item is missing" >&2
    exit 1
  fi
done
echo "✓ Preflight passed — theme structure valid (${required[*]})"

# --- 2. Stage ONLY the theme contents (root-level, nothing else) -------------
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -R "$SRC"/. "$STAGE"/
rm -rf "$STAGE/.git" "$STAGE/.DS_Store" "$STAGE/Thumbs.db"

# --- 3. Init, commit, push to main -------------------------------------------
cd "$STAGE"
git init -b "$BRANCH" -q
# Ensure a commit identity exists (repo-local only — never touches your global Git settings)
[ -n "$(git config user.email)" ] || git config user.email "affyahmed1@users.noreply.github.com"
[ -n "$(git config user.name)" ]  || git config user.name  "affyahmed1"
git add -A
git commit -q -m "Kin & Tail — Shopify Online Store 2.0 theme (initial import)"
git remote add origin "$REPO_URL"
git push -u origin "$BRANCH"

# --- 4. Verify ----------------------------------------------------------------
echo ""
echo "✓ Pushed to $REPO_URL"
echo "  Branch : $BRANCH"
echo "  Root   : assets/ config/ layout/ locales/ sections/ snippets/ templates/ + README.md"
echo ""
echo "Next: Shopify Admin → Online Store → Themes → Add theme → Connect from GitHub"
echo "      → authorize → select affyahmed1/kin-and-tail-theme, branch: main"
