#!/bin/bash
set -e
if [ -f packages/app/node_modules/.bin/my-tool ]; then
    echo "OK: my-tool is linked in packages/app/node_modules/.bin/"
else
    echo "FAIL: my-tool is NOT linked in packages/app/node_modules/.bin/"
    exit 1
fi
