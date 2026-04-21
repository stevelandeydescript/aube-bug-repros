# Type incompatibility with different openai versions under strict virtual store isolation

## Summary

When two workspace packages depend on different major versions of `openai` (v4 and v6),
TypeScript treats `ChatCompletionMessageParam` from each version as incompatible types
under aube's strict virtual store layout, even though the types are structurally identical.

This happens because aube isolates each resolved version under its own virtual store path
(`node_modules/.aube/openai@4.47.1/...` vs `node_modules/.aube/openai@6.34.0/...`).
TypeScript resolves the type declarations from these distinct paths and treats them as
separate types. Even though `ChatCompletionMessageParam` has the same shape in both
versions, TypeScript's module identity is path-based, so they don't unify.

With pnpm, hoisting means both packages resolve their imports through a single physical
copy of the type declarations, so TypeScript sees one type identity and everything checks.

This is a known limitation of strict package isolation rather than a correctness bug, but
it represents a real regression when migrating from pnpm to aube in workspaces that depend
on multiple major versions of the same package.

## Workspace layout

```
packages/lib-old   -- depends on openai@^4.47.0, exports getMessages(): ChatCompletionMessageParam[]
packages/lib-new   -- depends on openai@^6.0.0, imports from lib-old and passes the result to an openai v6 API call
```

## Steps to reproduce

```sh
# With aube (fails):
aube install
cd packages/lib-new
npx tsc --noEmit
# Error: Type 'ChatCompletionMessageParam[]' (from openai@4) is not assignable
#        to type 'ChatCompletionMessageParam[]' (from openai@6)

# With pnpm (passes):
pnpm install
cd packages/lib-new
npx tsc --noEmit
# No errors
```

## Expected

TypeScript should pass in both cases. The types are structurally identical across
openai v4 and v6 for `ChatCompletionMessageParam`.

## Actual

Under aube, TypeScript reports a type mismatch because the declarations live at
different virtual store paths, giving them distinct type identities.

## Why this matters

Many real-world monorepos have packages pinned to different major versions of a
shared dependency during migration periods. The types are often unchanged across
majors, so pnpm's hoisting makes them interoperable for free. Strict isolation
breaks this assumption and forces either version alignment across the entire
workspace or manual type assertions at every boundary.

## Versions

- aube 1.0.0-beta.10
- pnpm 10.33.0 (works correctly)
- typescript 5.7.x
