# Bug: workspace package bins not linked into dependent packages

## Summary

When workspace package A declares `"bin": {"my-tool": "./bin/my-tool.mjs"}` and
workspace package B depends on A via `workspace:*`, pnpm links `my-tool` into
`packages/B/node_modules/.bin/my-tool`. aube does not.

This breaks any workspace package that uses a custom bin from another workspace
package in its npm scripts (e.g. `"clean": "clean-js"` where `clean-js` is
provided by `@descript/js-dev`).

## Steps to reproduce

```sh
pnpm install
ls packages/app/node_modules/.bin/my-tool  # exists

rm -rf node_modules packages/app/node_modules
aube install
ls packages/app/node_modules/.bin/my-tool  # does not exist
```

## Expected

`packages/app/node_modules/.bin/my-tool` is a symlink to `tools/dev/bin/my-tool.mjs`.

## Actual

`packages/app/node_modules/.bin/` does not contain `my-tool`.

## Impact

Any workspace package that runs a bin provided by another workspace package will
fail with `sh: 1: <bin-name>: not found`. In our monorepo, `clean-js`, `fmt-js`,
and `lint-js` bins from `@descript/js-dev` are used by ~100 packages.

## Versions

- aube 1.0.0-1.2.1
- pnpm 10.33.0 (works correctly)
