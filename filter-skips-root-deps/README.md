# Bug: `--filter` does not install root workspace devDependencies

## Summary

When running `aube install --filter @repro/app...`, root workspace `devDependencies`
are not installed. pnpm installs them regardless of the filter.

This breaks CI workflows that use `--filter` to install a subset of the workspace
but then run root-level tools like `node -r esbuild-register`.

## Steps to reproduce

```sh
# With pnpm (works)
pnpm install --filter '@repro/app...'
node test.js
# OK: esbuild-register is resolvable from root

# With aube (fails)
aube install --filter '@repro/app...'
node test.js
# FAIL: esbuild-register is NOT resolvable from root
```

## Expected

Root workspace `devDependencies` are always installed, matching pnpm behavior.

## Actual

Root `devDependencies` are skipped when `--filter` is used, making root-level tools
like `node -r esbuild-register` unavailable.

## Impact

Any CI job that uses `--filter` to speed up installs and then runs a root-level tool
will fail. Common pattern: `aube install --filter @pkg/scripts...` followed by
`node -r esbuild-register ./scripts/some-script.ts`.

## Versions

- aube 1.0.0-beta.10
- pnpm 10.33.0 (installs root devDeps with --filter)
