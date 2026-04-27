# aube bug reproductions

Minimal test cases for bugs found migrating a 4,000+ package monorepo from pnpm to aube. Each directory is self-contained with a README explaining the bug, reproduction steps, and expected vs actual behavior.

GitHub Actions workflows compare aube against pnpm for each repro.

## Fixed

| #   | Directory                            | Fixed in | Bug                                                         |
| --- | ------------------------------------ | -------- | ----------------------------------------------------------- |
| 1   | `alias-override-conflict/`           | beta.10  | `npm:` alias replaced by unrelated override                 |
| 2   | `overrides-not-read-from-workspace/` | beta.10  | `overrides` in `pnpm-workspace.yaml` ignored                |
| 3   | `pnpm-lockfile-host-only-platforms/` | beta.10  | `pnpm-lock.yaml` only contained host platform optional deps |
| 4   | `filter-skips-root-deps/`            | beta.12  | `--filter` skipped root devDependencies                     |
| 5   | `frozen-lockfile-catalog-override/`  | 1.1.0    | `--frozen-lockfile` rejected `catalog:` in overrides        |

## Open (as of 1.2.1)

### 6. `workspace-bin-not-linked/` — workspace bins not linked

When workspace package A declares `"bin": {"my-tool": ...}` and package B depends on A via `workspace:*`, pnpm links `my-tool` into `B/node_modules/.bin/`. aube does not.

This blocks any monorepo that runs shared tooling bins (like `clean-js`, `fmt-js`, `lint-js`) across workspace packages.

### 7. `frozen-lockfile-override-specifier/` — overrides not applied before specifier comparison

When an override rewrites a dependency specifier (e.g. `plist@<3.0.5` → `>=3.0.5`), pnpm records the override target in the lockfile and `--frozen-lockfile` accepts it. aube compares the original manifest specifier against the lockfile and fails. This affects all security overrides that pin vulnerable transitive deps to safe versions.

### 8. `exotic-git-dep-resolution/` — git URL deps blocked by default

`@electron/rebuild` depends on `@electron/node-gyp` via a git URL. aube blocks it with `blockExoticSubdeps` (enabled by default). Workaround: `block-exotic-subdeps=false` in `.npmrc`. This is a configuration gap rather than a correctness bug — but the default differs from pnpm, which resolves git deps without extra config.
