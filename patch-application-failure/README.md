# Bug: patch application fails on valid pnpm patch

## Summary

A pnpm-generated patch for `gifuct-js@2.1.2` applies correctly with pnpm but
fails with aube. The installed file's git blob hash matches the patch's
pre-image hash exactly, so the patch should apply cleanly.

## Steps to reproduce

```sh
pnpm install       # works, patch applies
rm -rf node_modules pnpm-lock.yaml
aube install       # fails: "error applying hunk #1"
```

## Verification that the file matches

```sh
# Install without patch to get the original file
# (temporarily remove patchedDependencies from pnpm-workspace.yaml)
aube install
git hash-object node_modules/gifuct-js/index.d.ts
# fb0b487b4985011a94026807b2586ed838207935

# The patch header says:
# index fb0b487b4985011a94026807b2586ed838207935..db2d2f91...
# Pre-image hash matches exactly.
```

## Expected

Patch applies successfully. The pre-image hash matches, the context lines match,
the hunks are clean.

## Actual

```
Error: × prewarm GVS for gifuct-js@2.1.2: failed to apply patch for
       gifuct-js@2.1.2: failed to apply patch for index.d.ts: error applying hunk #1
```

## Versions

- aube 1.4.0
- pnpm 10.33.0 (works correctly)
