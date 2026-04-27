# Bug: git URL dependencies fail to resolve

## Summary

`@electron/rebuild` depends on `@electron/node-gyp` via a git URL
(`git+https://github.com/electron/node-gyp.git#<sha>`). pnpm resolves this
correctly. aube fails with "uses exotic specifier ... which is blocked by
blockExoticSubdeps".

## Steps to reproduce

```sh
pnpm install       # works
bash test.sh       # OK

rm -rf node_modules packages/app/node_modules pnpm-lock.yaml
aube install       # fails
bash test.sh       # FAIL
```

## Expected

aube resolves git URL dependencies the same as pnpm.

## Actual

```
Error: × failed to resolve dependencies
  ╰─▶ registry error for @electron/node-gyp: uses exotic specifier
      "git+https://github.com/electron/node-gyp.git#..." which is blocked
      by blockExoticSubdeps (declared by @electron/rebuild)
```

## Versions

- aube 1.2.1
- pnpm 10.33.0 (works correctly)
