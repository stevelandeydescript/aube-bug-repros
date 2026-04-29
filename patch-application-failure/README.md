# Bug: patch application fails on valid pnpm patch

## Summary

A pnpm-generated patch for `gifuct-js@2.1.2` applies correctly with pnpm but
fails with aube. The patch modifies `index.d.ts` to make `gce` optional and add
an `lct` property.

## Steps to reproduce

```sh
pnpm install       # works, patch applies
rm -rf node_modules pnpm-lock.yaml
aube install       # fails: "error applying hunk #1"
```

## Expected

aube applies the same patch files that pnpm generates and applies.

## Actual

```
Error: × failed to apply patch for gifuct-js@2.1.2: failed to apply patch for
       index.d.ts: error applying hunk #1
```

## Versions

- aube 1.4.0
- pnpm 10.33.0 (works correctly)
