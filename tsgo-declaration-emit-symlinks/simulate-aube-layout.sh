#!/bin/bash
# Simulate aube's virtual store layout.
#
# aube creates per-package node_modules with symlinks into a per-package
# .aube/ virtual store, unlike pnpm which uses a single root-level .pnpm/
# store. The real files are identical, but the symlink paths differ between
# packages — which is what triggers the tsgo declaration emit bug.

set -euo pipefail
cd "$(dirname "$0")"

# Start from the working pnpm layout
REAL_TYPE_FEST="$(realpath node_modules/.pnpm/type-fest@3.13.1/node_modules/type-fest)"

# Create per-package .aube virtual store directories
mkdir -p packages/lib/node_modules/.aube/type-fest@3.13.1/node_modules
mkdir -p packages/app/node_modules/.aube/type-fest@3.13.1/node_modules

# Copy real type-fest into each virtual store (simulating aube's content-addressed store)
# In real aube, these would be hardlinks or copies from a global store
cp -R "$REAL_TYPE_FEST" packages/lib/node_modules/.aube/type-fest@3.13.1/node_modules/type-fest
cp -R "$REAL_TYPE_FEST" packages/app/node_modules/.aube/type-fest@3.13.1/node_modules/type-fest

# Replace the pnpm symlinks with aube-style symlinks (pointing to per-package .aube store)
rm -f packages/lib/node_modules/type-fest
rm -f packages/app/node_modules/type-fest
ln -s .aube/type-fest@3.13.1/node_modules/type-fest packages/lib/node_modules/type-fest
ln -s .aube/type-fest@3.13.1/node_modules/type-fest packages/app/node_modules/type-fest

echo "Simulated aube layout:"
echo "  lib/node_modules/type-fest -> $(readlink packages/lib/node_modules/type-fest)"
echo "  app/node_modules/type-fest -> $(readlink packages/app/node_modules/type-fest)"
echo ""
echo "Real paths (should differ):"
echo "  lib: $(realpath packages/lib/node_modules/type-fest)"
echo "  app: $(realpath packages/app/node_modules/type-fest)"
