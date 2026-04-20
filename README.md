# aube bug reproductions

Minimal test cases for bugs found migrating a large monorepo from pnpm to aube.
Each directory is self-contained: `cd` into it and run the commands in its README.

GitHub Actions workflows run each repro on push, comparing aube's behavior against pnpm.

Tested with aube 1.0.0-beta.9.

## Bugs

1. **`alias-override-conflict/`** — When a dependency uses an `npm:` alias
   (e.g. `"immer": "npm:@other-pkg/immer@6.0.9"`), aube incorrectly applies
   a version-range override meant for the unaliased package. The override range
   doesn't even match the alias target's version, but aube replaces it anyway.

2. **`overrides-not-read-from-workspace/`** — aube does not read `overrides` from
   `pnpm-workspace.yaml`. pnpm v10 supports this; aube ignores it. Symptom:
   `--frozen-lockfile` fails with "manifest removes". Workaround: duplicate
   overrides into `package.json` `pnpm.overrides`.

3. **`pnpm-lockfile-host-only-platforms/`** — When aube generates `pnpm-lock.yaml`,
   it only includes optional dependency entries for the host platform. pnpm includes
   all platforms. A lockfile generated on Linux lacks macOS/Windows native binaries,
   breaking `--frozen-lockfile` and tools like esbuild on other platforms.
