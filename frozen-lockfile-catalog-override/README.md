# Bug: --frozen-lockfile rejects catalog: references in overrides

## Summary

When `pnpm-workspace.yaml` uses `catalog:` in an override value (e.g. `lodash: "catalog:"`),
pnpm resolves it to the catalog version before comparing against the lockfile. aube compares
the raw `catalog:` string against the lockfile's resolved value, causing `--frozen-lockfile`
to always fail.

## Steps to reproduce

```sh
pnpm install                    # generates lockfile with resolved override (4.17.21)
aube install --frozen-lockfile  # fails: "lodash changed (4.17.21 → catalog:)"
```

## Expected

aube resolves `catalog:` to `4.17.21` before comparing, finds they match, passes.

## Actual

```
Error: × lockfile is out of date with package.json: overrides: lodash changed (4.17.21 → catalog:)
```

## Impact

Any project using `catalog:` references in overrides cannot use `--frozen-lockfile` with
a pnpm-generated lockfile. This blocks CI workflows that rely on frozen lockfile checks.

## Workaround

Replace `catalog:` references in overrides with literal values. This duplicates the version
and loses the single-source-of-truth benefit of the catalog.

## Versions

- aube 1.0.0-beta.12
- pnpm 10.33.0 (works correctly)
