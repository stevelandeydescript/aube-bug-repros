# aube bug reproductions

Minimal test cases for bugs found migrating a large monorepo from pnpm to aube.
Each directory is self-contained: `cd` into it and run the commands in its README.

GitHub Actions workflows run each repro on push, comparing aube's behavior against pnpm.

## Fixed in beta.10

Bug 1 (`alias-override-conflict/`) was fixed in beta.10. The repro and CI workflow remain
as a regression test.

## Bugs (as of beta.10)

1. **`alias-override-conflict/`** — _Fixed in beta.10._ When a dependency uses an `npm:` alias
   (e.g. `"immer": "npm:@other-pkg/immer@6.0.9"`), aube incorrectly applies a version-range
   override meant for the unaliased package. The CI workflow now passes on beta.10+.

2. **`overrides-not-read-from-workspace/`** — aube does not read `overrides` from
   `pnpm-workspace.yaml`. pnpm v10 supports this; aube ignores it. Symptom:
   `--frozen-lockfile` fails with "manifest removes". Workaround: duplicate
   overrides into `package.json` `pnpm.overrides`.

3. **`pnpm-lockfile-host-only-platforms/`** — When aube generates `pnpm-lock.yaml`,
   it only includes optional dependency entries for the host platform. pnpm includes
   all platforms. A lockfile generated on Linux lacks macOS/Windows native binaries,
   breaking `--frozen-lockfile` and tools like esbuild on other platforms.
