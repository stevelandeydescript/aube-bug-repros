# Bug: aube does not read overrides from pnpm-workspace.yaml

## Summary

pnpm v10 supports `overrides` in `pnpm-workspace.yaml`. aube ignores them. The resolver
applies overrides during `aube install` (they end up in the lockfile), but the lockfile
freshness checker reads overrides only from `package.json`, so it concludes the lockfile
is stale.

## Steps to reproduce

```sh
aube install                    # succeeds, writes overrides to lockfile
aube install --frozen-lockfile  # fails: "manifest removes semver"
```

## Expected

aube reads overrides from `pnpm-workspace.yaml`, matching pnpm v10 behavior.

## Actual

```
Error: × lockfile is out of date with package.json: overrides: manifest removes semver
```

## Workaround

Duplicate overrides into `package.json` under `"pnpm": { "overrides": { ... } }`.

## Versions

- aube 1.0.0-beta.10
- pnpm 10.33.0 (reads overrides from pnpm-workspace.yaml correctly)
