# Bug: aube cannot apply its own patches

## Summary

`aube patch-commit` generates a valid patch file, then immediately fails to
apply it. The patch is clean (correct context, correct hunks), and pnpm applies
it without issues.

## Steps to reproduce

```sh
# 1. Install without patches
aube install

# 2. Start patching
aube patch gifuct-js@2.1.2
# Edit the temp dir: make gce optional, add lct property

# 3. Commit the patch
aube patch-commit '<temp-dir>'
# Writes patches/gifuct-js@2.1.2.patch
# Then fails: "error applying hunk #1"
```

Or, using the pre-generated patch in this repro:

```sh
pnpm install       # works, applies the patch
rm -rf node_modules pnpm-lock.yaml
aube install       # fails: "error applying hunk #1"
```

## The generated patch

```diff
--- a/index.d.ts
+++ b/index.d.ts
@@ -8,7 +8,7 @@
 type Frame = {
-  gce: {
+  gce?: {
@@ -27,6 +27,7 @@
       blocks: number[]
     }
+    lct?: [number, number, number][]
     descriptor:
```

Both hunks are clean. The pre-image matches the installed file exactly
(verified via `git hash-object`).

## Versions

- aube 1.4.0
- pnpm 10.33.0 (works correctly)
