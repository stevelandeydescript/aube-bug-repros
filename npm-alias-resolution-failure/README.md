# Bug: npm: aliases in transitive dependencies treated as real package names

## Summary

When a transitive dependency uses `npm:` aliases to map a local name to a real package
(e.g. `"string-width-cjs": "npm:string-width@^4.2.0"` in `@isaacs/cliui@8.0.2`), aube
resolves the alias name as a literal package on npm instead of following the alias.

The real `string-width-cjs` package on npm only has versions 1.0.0 and 5.1.1, so aube
fails to find a version matching the aliased range.

pnpm resolves these aliases correctly.

## Steps to reproduce

```sh
pnpm install          # succeeds, installs jackspeak and all transitive deps
rm -rf node_modules packages/app/node_modules pnpm-lock.yaml
aube install          # fails resolving string-width-cjs
```

## Expected

`aube install` resolves `npm:` aliases in transitive dependencies the same way pnpm does,
installing `string-width@^4.2.0` when the dependency is declared as
`"string-width-cjs": "npm:string-width@^4.2.0"`.

## Actual

```
Error:   x failed to resolve dependencies
  |-> no version of string-width-cjs matches range `string-width@4.2.3`
  help: chain: jackspeak@4.1.1 > @isaacs/cliui@8.0.2 > string-width-cjs
        available versions: 5.1.1, 1.0.0
```

aube treats `string-width-cjs` as a real npm package name and fails because none of its
published versions satisfy the aliased range. The same failure occurs for `strip-ansi-cjs`
and `wrap-ansi-cjs`.

## Versions

- aube 1.5.1
- pnpm 10.33.0 (works correctly)
