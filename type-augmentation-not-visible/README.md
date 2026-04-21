# Type augmentation not visible across workspace packages

## Bug

In a pnpm workspace, `@repro/types` declares a type augmentation for `@hapi/hapi`, extending `AuthCredentials` with an `isMCPClient` property. `@repro/app` depends on both `@hapi/hapi` and `@repro/types` (via `workspace:*`) and expects to see the augmented types.

With pnpm, this works because TypeScript resolves `@hapi/hapi` to a single hoisted copy in `node_modules/.pnpm/`. The `declare module "@hapi/hapi"` augmentation from `@repro/types` and the original types from `@hapi/hapi` merge into the same module identity.

With aube's virtual store, each package gets its own isolated `@hapi/hapi` resolution. The augmentation in `@repro/types` targets a different module identity than the one `@repro/app` resolves, so the augmented properties are not visible.

## Reproduction

```
pnpm install
cd packages/app
pnpm exec tsc --noEmit
```

With pnpm: typechecks successfully.
With aube: `Property 'isMCPClient' does not exist on type 'AuthCredentials'.`

## Workspace layout

```
packages/types/     - declares the augmentation for @hapi/hapi
packages/app/       - uses @hapi/hapi and expects augmented types
```
