# temporal-duration-type

Reproduction for a type-checking regression when switching from pnpm to aube.

## The bug

`@temporalio/common@1.15.0` declares `ms: 3.0.0-canary.1` as a dependency.
That version of `ms` exports a `StringValue` type defined as a template literal
(`${number}${UnitAnyCase}`), and Temporal's `Duration` type is
`StringValue | number`.

With **pnpm**, `ms@2.1.3` (pulled in by many other packages) gets hoisted to
the root `node_modules`. When TypeScript resolves the `Duration` type through
`@temporalio/common`, it follows the hoisted `ms@2.x` where `StringValue` is
just `string`. So code like `proxyActivities({ retry: { initialInterval: '1s' } })`
compiles fine because `'1s'` is assignable to `string | number`.

With **aube**, strict isolation means `@temporalio/common` correctly gets
`ms@3.0.0-canary.1` as declared. TypeScript now sees `Duration` as
`` `${number}${UnitAnyCase}` | number ``, and `'1s'` (inferred as the string
literal type `"1s"`) fails because it does not match the template pattern. The
template expects forms like `"1 second"` or `"1s"` but TypeScript's template
literal matching is stricter than runtime parsing.

In short: aube gives the **correct** version of `ms` per the declared dependency,
while pnpm accidentally gives the wrong one. But the "correct" version breaks
type-checking for a common Temporal usage pattern.

## Reproducing

```sh
# With pnpm (passes):
pnpm install
cd packages/app
pnpm exec tsc --noEmit    # OK

# With aube (fails):
aube install
cd packages/app
aube exec tsc --noEmit    # Type error on Duration strings
```

## Question for the aube team

This is not a resolution bug in the usual sense: aube is giving
`@temporalio/common` exactly the version of `ms` it asked for. The breakage
comes from the fact that pnpm's hoisting accidentally masked the strict template
literal type by substituting `ms@2.x`, and a lot of existing code was written
(and type-checked) against that looser type.

Is this intended behavior? Should aube match pnpm's deduplication strategy in
cases where a newer version of a transitive dependency introduces stricter types?
Or is this something library authors (Temporal) need to fix on their end by
either widening the type or pinning `ms` differently?
