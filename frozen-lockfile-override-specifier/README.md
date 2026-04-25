# Bug: --frozen-lockfile rejects specifiers changed by overrides

## Summary

When a workspace override rewrites a dependency specifier (e.g. `plist@<3.0.5` → `>=3.0.5`),
pnpm records the override target (`>=3.0.5`) as the lockfile specifier and accepts it with
`--frozen-lockfile`. aube compares the original manifest specifier (`^3.0.4`) against the
lockfile specifier (`>=3.0.5`) and considers the lockfile stale.

## Steps to reproduce

```sh
pnpm install                    # generates lockfile with override-applied specifier
pnpm install --frozen-lockfile  # passes
rm -rf node_modules
aube install --frozen-lockfile  # fails
```

## Expected

aube applies overrides to the manifest specifier before comparing against the lockfile.

## Actual

```
Error: × lockfile is out of date with package.json: packages/app: plist: manifest says ^3.0.4, lockfile says >=3.0.5
```

## Versions

- aube 1.1.0
- pnpm 10.33.0 (works correctly)
