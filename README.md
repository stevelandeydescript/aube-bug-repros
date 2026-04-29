# aube bug reproductions

Minimal test cases for bugs found migrating a large monorepo from pnpm to aube. Each directory is self-contained with a README explaining the bug, reproduction steps, and expected vs actual behavior.

GitHub Actions workflows compare aube against pnpm for each repro.

## Fixed

| #   | Directory                            | Fixed in | Bug                                                         |
| --- | ------------------------------------ | -------- | ----------------------------------------------------------- |
| 1   | `alias-override-conflict/`           | beta.10  | `npm:` alias replaced by unrelated override                 |
| 2   | `overrides-not-read-from-workspace/` | beta.10  | `overrides` in `pnpm-workspace.yaml` ignored                |
| 3   | `pnpm-lockfile-host-only-platforms/` | beta.10  | `pnpm-lock.yaml` only contained host platform optional deps |
| 4   | `filter-skips-root-deps/`            | beta.12  | `--filter` skipped root devDependencies                     |
| 5   | `frozen-lockfile-catalog-override/`  | 1.1.0    | `--frozen-lockfile` rejected `catalog:` in overrides        |
| 6   | `workspace-bin-not-linked/`          | 1.4.0    | workspace bins not linked into dependents' `.bin/`          |
| 7   | `frozen-lockfile-override-specifier/`| 1.4.0    | `--frozen-lockfile` rejected override-rewritten specifiers  |

## Open (as of 1.4.0)

### 8. `exotic-git-dep-resolution/` — git URL deps blocked by default

`@electron/rebuild` depends on `@electron/node-gyp` via a git URL. aube blocks it with `blockExoticSubdeps` (enabled by default). Workaround: `block-exotic-subdeps=false` in `.npmrc`. The default differs from pnpm, which resolves git deps without extra config.

### 9. `patch-application-failure/` — patch application fails on valid pnpm patch

A pnpm-generated patch for `gifuct-js@2.1.2` applies correctly with pnpm but fails with aube ("error applying hunk #1"). The patch modifies `index.d.ts` to make a property optional and add a new property.
