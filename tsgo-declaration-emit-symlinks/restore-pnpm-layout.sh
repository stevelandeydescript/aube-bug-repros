#!/bin/bash
# Restore the pnpm symlink layout (undo simulate-aube-layout.sh).

set -euo pipefail
cd "$(dirname "$0")"

rm -rf packages/lib/node_modules/.aube
rm -rf packages/app/node_modules/.aube
rm -f packages/lib/node_modules/type-fest
rm -f packages/app/node_modules/type-fest

ln -s ../../../node_modules/.pnpm/type-fest@3.13.1/node_modules/type-fest packages/lib/node_modules/type-fest
ln -s ../../../node_modules/.pnpm/type-fest@3.13.1/node_modules/type-fest packages/app/node_modules/type-fest

echo "Restored pnpm layout:"
echo "  lib/node_modules/type-fest -> $(readlink packages/lib/node_modules/type-fest)"
echo "  app/node_modules/type-fest -> $(readlink packages/app/node_modules/type-fest)"
