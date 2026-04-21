# Bug: @types/\* packages not resolvable through aube's virtual store symlinks

## Summary

When a package depends on `@types/hapi__hapi` (DefinitelyTyped types for `@hapi/hapi`),
aube installs the types package via a symlink into its virtual store. TypeScript cannot
resolve the types through the symlink, causing all type information from `@types/hapi__hapi`
to be missing.

This affects any `@types/*` package that provides types for a package that doesn't ship its own.

## Steps to reproduce

```sh
aube install
npx tsc --noEmit
```

## Expected

TypeScript compiles cleanly. `res.statusCode`, `res.headers`, and `res.payload` are typed
correctly via `@types/hapi__hapi`.

## Actual

TypeScript reports errors like:

```
test.ts: error TS2339: Property 'statusCode' does not exist on type 'ServerInjectResponse<object>'.
```

The types are installed at `node_modules/@types/hapi__hapi/` (symlinked to the virtual store)
but TypeScript can't resolve them.

## Comparison with pnpm

```sh
pnpm install
npx tsc --noEmit
# Compiles cleanly
```

## Impact

In our monorepo, this causes ~6000 type errors in `services/api` alone, since every test file
uses `server.inject()` and expects typed responses.

## Versions

- aube 1.0.0-beta.10
- TypeScript 5.x / 6.x
- pnpm 10.33.0 (works correctly)
