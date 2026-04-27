#!/bin/bash
set -e
if [ -d packages/app/node_modules/@electron/rebuild ]; then
    echo "OK: @electron/rebuild installed"
else
    echo "FAIL: @electron/rebuild not installed"
    exit 1
fi
