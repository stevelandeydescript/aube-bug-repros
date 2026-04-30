# aube bug reproductions

Minimal test cases for bugs found migrating a large monorepo from pnpm to aube. Each directory is self-contained with a README explaining the bug, reproduction steps, and expected vs actual behavior.

GitHub Actions workflows compare aube against pnpm for each repro.

## Fixed

| #   | Directory                             | Fixed in | Bug                                                          |
| --- | ------------------------------------- | -------- | ------------------------------------------------------------ |
| 1   | `alias-override-conflict/`            | beta.10  | `npm:` alias replaced by unrelated override                  |
| 2   | `overrides-not-read-from-workspace/`  | beta.10  | `overrides` in `pnpm-workspace.yaml` ignored                 |
| 3   | `pnpm-lockfile-host-only-platforms/`  | beta.10  | `pnpm-lock.yaml` only contained host platform optional deps  |
| 4   | `filter-skips-root-deps/`             | beta.12  | `--filter` skipped root devDependencies                      |
| 5   | `frozen-lockfile-catalog-override/`   | 1.1.0    | `--frozen-lockfile` rejected `catalog:` in overrides         |
| 6   | `workspace-bin-not-linked/`           | 1.4.0    | workspace bins not linked into dependents' `.bin/`           |
| 7   | `frozen-lockfile-override-specifier/` | 1.4.0    | `--frozen-lockfile` rejected override-rewritten specifiers   |
| 9   | `patch-application-failure/`          | 1.5.0    | patch fails despite matching pre-image hash                  |
| 10  | `catalog-npm-alias/`                  | 1.5.0    | `npm:` aliases from catalog not installed from pnpm lockfile |

## Open

| #   | Directory                       | Bug                                                             |
| --- | ------------------------------- | --------------------------------------------------------------- |
| 11  | `npm-alias-resolution-failure/` | `npm:` aliases in transitive deps treated as real package names |

## Expected behavior / config gap

### 8. `exotic-git-dep-resolution/`

`@electron/rebuild` depends on `@electron/node-gyp` via a git URL. aube blocks
this by default via `blockExoticSubdeps`. Set `blockExoticSubdeps: false` in
`pnpm-workspace.yaml` to allow it.
