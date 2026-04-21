# Bug: npm: alias overridden by unrelated pnpm override

## Summary

When a dependency uses an `npm:` alias (e.g. `"immer": "npm:@descript/immer@6.0.9-patched.1"`),
aube incorrectly applies a version-range override meant for the *unaliased* package, replacing
the alias target entirely.

## Steps to reproduce

```sh
aube install
node -e "const p = require('./node_modules/immer/package.json'); console.log(p.name, p.version)"
```

## Expected

```
@descript/immer 6.0.9-patched.1
```

The override `immer@>=7.0.0 <9.0.6` should not match `@descript/immer@6.0.9-patched.1` because:
1. The dependency resolves to `@descript/immer`, a different package
2. Even by version alone, `6.0.9-patched.1` is outside the range `>=7.0.0 <9.0.6`

## Actual

```
immer 11.1.4
```

aube ignores the npm: alias and installs the latest immer matching the override's replacement
range (`>=9.0.6`), which resolves to `immer@11.1.4`.

## Comparison with pnpm

```sh
pnpm install
node -e "const p = require('./node_modules/immer/package.json'); console.log(p.name, p.version)"
# Output: @descript/immer 6.0.9-patched.1
```

pnpm correctly installs the alias target and does not apply the override.

## Impact

Any project using npm: aliases alongside overrides for the same package name gets the wrong
dependency installed. This causes type errors (wrong TypeScript declarations) and potentially
wrong runtime behavior.

## Versions

- aube 1.0.0-beta.10
- pnpm 10.33.0 (works correctly)
