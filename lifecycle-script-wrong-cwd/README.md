# Lifecycle script runs with wrong working directory

When aube runs a dependency's lifecycle script (e.g. postinstall), the script's
working directory or package resolution path points to the virtual store
directory root (`node_modules/.aube/PKG@VERSION/`) rather than the actual
package directory (`node_modules/.aube/PKG@VERSION/node_modules/PKG/`).

## Reproduction

```sh
git init
pnpm install     # succeeds, sets up git hooks
rm -rf node_modules
aube install     # fails with ENOENT on simple-git-hooks postinstall
```

## Expected behavior

`aube install` succeeds like `pnpm install` does. The postinstall script should
run with its working directory set to the package's own directory within the
virtual store, so that `package.json` resolves correctly.

## Actual behavior

`simple-git-hooks@2.13.1`'s postinstall script calls `_getPackageJson()`, which
uses `binding.stat(packageJsonPath)` to locate `package.json`. Under aube, the
path resolves to:

```
node_modules/.aube/simple-git-hooks@2.13.1/package.json
```

That file doesn't exist. The real `package.json` is at:

```
node_modules/.aube/simple-git-hooks@2.13.1/node_modules/simple-git-hooks/package.json
```

Error:

```
Error: ENOENT: no such file or directory, stat '.../node_modules/.aube/simple-git-hooks@2.13.1/package.json'
```

pnpm runs the same postinstall script with the correct working directory, so the
script finds `package.json` as expected.
