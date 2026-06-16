#!/usr/bin/env bash
# Sync shared graphics files from numbl → numbl-vscode.
#
# The canonical source is numbl/src/graphics/.  The vscode extension
# keeps its own copy at webview/graphics/ because the webview bundle
# is built independently.  Run this script after changing any graphics
# file in the numbl repo.
#
# All *.ts and *.tsx files from the source directory are copied.
# Files that exist only in the destination (vscode-specific, e.g.
# restoreNaNs.ts) are left untouched.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VSCODE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# numbl lives beside numbl-vscode (override with NUMBL_DIR).
NUMBL_DIR="${NUMBL_DIR:-${VSCODE_ROOT}/../numbl}"
SRC="${NUMBL_DIR}/src/graphics"
DEST="${VSCODE_ROOT}/webview/graphics"

if [ ! -d "$SRC" ]; then
  echo "Error: numbl graphics source not found at $SRC" >&2
  echo "Set NUMBL_DIR to the numbl repo root." >&2
  exit 1
fi

changed=0
for src_file in "$SRC"/*.ts "$SRC"/*.tsx; do
  [ -f "$src_file" ] || continue
  f="$(basename "$src_file")"
  dst="$DEST/$f"
  if ! diff -q "$src_file" "$dst" >/dev/null 2>&1; then
    cp "$src_file" "$dst"
    echo "  synced $f"
    changed=$((changed + 1))
  fi
done

if [ "$changed" -eq 0 ]; then
  echo "All graphics files are already in sync."
else
  echo "Synced $changed file(s)."
fi
