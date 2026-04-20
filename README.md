# aube bug reproductions

Minimal test cases for bugs found migrating a large monorepo from pnpm to aube.
Each directory is self-contained: `cd` into it and run the commands in the README.

Tested with aube 1.0.0-beta.9.

## Bugs

1. **`alias-override-conflict/`** — `npm:` alias replaced by an unrelated `pnpm.overrides` entry.
   The override range doesn't even match the alias target's version, but aube applies it anyway.
   Couldn't find a workaround for this so it blocks my migration.

2. **`overrides-not-read-from-workspace/`** — aube does not read `overrides` from
   `pnpm-workspace.yaml`. pnpm v10 supports this; aube ignores it. Symptom: `--frozen-lockfile`
   fails with "manifest removes". Workaround: duplicate overrides into `package.json`.
