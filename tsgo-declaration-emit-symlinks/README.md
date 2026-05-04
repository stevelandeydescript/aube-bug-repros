# Bug: declaration emit fails when per-package virtual store creates divergent symlink paths

## Summary

When two workspace packages both depend on the same version of a shared type
package (e.g. `type-fest@3.13.1`), aube creates per-package symlinks that
resolve to different real paths, even though the underlying files are identical.
`tsgo --build` and `tsc --build` use the symlink-resolved paths (before
realpath) to determine whether a type is accessible for declaration emit. When
the paths diverge between packages, the emitter rejects the type as
inaccessible.

With pnpm, both packages' `node_modules/type-fest` symlinks point to the same
intermediate path under `.pnpm/`, so the declaration emitter considers them the
same package and emits successfully.

Layout comparison:

```
# pnpm — both symlinks resolve to the same intermediate path
packages/lib/node_modules/type-fest -> ../../../node_modules/.pnpm/type-fest@3.13.1/node_modules/type-fest
packages/app/node_modules/type-fest -> ../../../node_modules/.pnpm/type-fest@3.13.1/node_modules/type-fest

# aube — each package gets its own virtual store path
packages/lib/node_modules/type-fest -> .aube/type-fest@3.13.1/node_modules/type-fest
packages/app/node_modules/type-fest -> .aube/type-fest@3.13.1/node_modules/type-fest
# These resolve to different real paths despite identical content.
```

## Steps to reproduce

### 1. Install dependencies with pnpm

```sh
pnpm install
```

### 2. Verify both compilers succeed with pnpm's layout

```sh
# Clean build artifacts
rm -rf packages/lib/dist packages/app/dist packages/*/tsconfig.tsbuildinfo

# tsgo --build
npx tsgo --build        # succeeds

# tsc --build
rm -rf packages/lib/dist packages/app/dist packages/*/tsconfig.tsbuildinfo
npx tsc --build         # succeeds
```

### 3. Simulate aube's per-package virtual store layout

```sh
bash simulate-aube-layout.sh
```

This replaces the pnpm symlinks with aube-style per-package symlinks. Each
package's `node_modules/type-fest` points to its own `.aube/` virtual store
directory instead of the shared `.pnpm/` store.

### 4. Verify both compilers fail with aube's layout

```sh
rm -rf packages/lib/dist packages/app/dist packages/*/tsconfig.tsbuildinfo

npx tsgo --build        # TS2883
npx tsc --build         # TS2742
```

### 5. Restore pnpm layout

```sh
bash restore-pnpm-layout.sh
```

## Expected behavior

Declaration emit succeeds regardless of whether the package manager uses a
shared virtual store (pnpm) or per-package virtual stores (aube), because the
underlying type package is the same version with the same content.

## Actual behavior

`tsgo --build` fails with:

```
packages/app/src/index.ts(6,14): error TS2883: The inferred type of 'defaultUser'
cannot be named without a reference to 'Opaque' from
'@repro/lib/node_modules/.aube/type-fest@3.13.1/node_modules/type-fest'.
This is likely not portable. A type annotation is necessary.
```

`tsc --build` fails with:

```
packages/app/src/index.ts(6,14): error TS2742: The inferred type of 'defaultUser'
cannot be named without a reference to
'@repro/lib/node_modules/.aube/type-fest@3.13.1/node_modules/type-fest'.
This is likely not portable. A type annotation is necessary.
```

Both errors indicate the declaration emitter sees `type-fest` at
`lib/node_modules/.aube/...` as a different package than `type-fest` at
`app/node_modules/.aube/...`, because the resolved symlink paths differ.

## Workaround

Add explicit type annotations to any exported values whose inferred types
reference shared type packages:

```ts
import type { Opaque } from 'type-fest';
import { createUserId } from '@repro/lib';

export const defaultUser: Opaque<string, 'UserId'> = createUserId('user-default');
```

This is impractical at scale in large monorepos.

## Notes

This is arguably a bug in both TypeScript compilers (tsgo and tsc) rather than
in aube specifically — the declaration emitter should use realpath (or
content-based identity) to determine if two packages are the same. However, aube
is the only package manager that creates this symlink layout, so it's the only
one affected in practice.

## Versions

- aube 1.8.0 (simulated via `simulate-aube-layout.sh`)
- @typescript/native-preview 7.0.0-dev.20260504.1
- typescript 5.8.3
- pnpm 10.33.0
