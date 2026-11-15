---
name: implement-admin-feature
description: 'Implementation workflow for building a feature/page/form/table in the cpap-rentals-admin-ui console, strictly aligned to our coding standards (schema pull/codegen first, lint rules, hook hygiene, RHF+Zod forms, atomic components, DataTable, theme tokens, file naming). USE WHEN the user says "implement this feature", "implement this feature on our admin ui", or "implement this feature on our admin console". Always produces a short plan and STOPS for explicit user approval before writing any code, and stops again for separate approval if a new npm package is required. DO NOT USE for pure planning-only requests (use feature-blueprint instead) or for one-line bug fixes.'
argument-hint: '<feature/page/form to implement> (e.g. "the coupons list page" or "resource category CRUD")'
---

# Implement Admin Feature

Workflow for actually **writing** a feature in `cpap-rentals-admin-ui`, not just planning it. Every step below is a hard gate — do not skip ahead.

## Hard Gates (non-negotiable)

1. **No code without approval.** After Step 2 (plan), present the plan and STOP. Do not create/edit any file until the user explicitly approves (e.g. "yes", "go ahead", "approved").
2. **No new package without separate approval.** If the plan requires adding any dependency not already in `package.json`, call it out explicitly as its own line item and get a distinct yes before running `pnpm add` or importing it. Prefer solving it with what's already installed (shadcn/ui, radix-ui, react-hook-form, zod, @tanstack/react-table, recharts, sonner, lucide-react, etc.) before proposing anything new.
3. If either gate is unresolved, stop and ask — never assume silence means yes.

## Procedure

### 1. Pull the latest backend contract first

Before touching schema-dependent code, refresh the generated types so the plan is never based on stale fields:

```bash
pnpm codegen:pull-schema   # refreshes src/lib/gql/schema.graphql from the running backend
pnpm codegen               # regenerates src/lib/gql/schema.ts + graphql.ts
```

If the backend isn't reachable locally, fall back to reading the current [schema.graphql](../../../src/lib/gql/schema.graphql) and flag any assumed field as unverified.

### 2. Draft the implementation plan (then STOP for approval)

Read [main-codebase.instructions.md](../../instructions/main-codebase.instructions.md) and skim the nearest existing feature under `src/features/` (customers, orders, products, rentals, inventory, shipping-providers) to mirror. Produce a short plan:

- Files to add/change (operations.ts / hooks.ts / schema.ts / form / route / column defs)
- Backend queries/mutations used, confirmed against `schema.ts` (flag anything missing as a backend dependency)
- Any new package required (separate, explicit line — see Hard Gate 2)
- Any theme/atomic component reuse (which DataTable columns, which shadcn primitives, which molecule/organism to reuse or add)

Present this plan and **wait for explicit approval** before writing code. If a new package is involved, ask for that approval distinctly (do not bundle it silently into the plan approval).

### 3. Implement — only after approval

Follow every rule below while writing code. These are the standards the user is enforcing; treat any deviation as a bug to fix before finishing.

#### Codegen & schema discipline

- Never hand-write GraphQL types — they come from `src/lib/gql/schema.ts` / `graphql.ts`.
- `*.operations.ts` uses `graphql()` from `@/lib/gql`, never `gql` from `@apollo/client`.
- After editing `*.operations.ts`, re-run `pnpm codegen`. After adding/renaming routes, re-run `pnpm generate-routes`.
- Derive list/detail item types from the generated query types (`ListXQuery['x']['edges'][number]['node']`) — never redeclare them.

#### Linting & TypeScript

- Zero `any`, no `!` non-null assertions, no `@ts-ignore` (use `@ts-expect-error` with a reason if unavoidable), no default exports, no `React.FC`.
- Explicit return types on all functions/components (`React.ReactElement`, not `React.FC`).
- `import type` for type-only imports; imports ordered node → external → `@/` alias → relative.
- Run `pnpm lint` (and `pnpm check` for formatting) before considering the task done; fix everything it flags — don't disable rules inline to silence it.

#### Hooks hygiene

- `useMemo` only for genuinely expensive derivations or to preserve referential identity consumed by memoized children/effect deps (e.g. deriving `ColumnDef[]`, deriving `ColumnFiltersState` from URL search params). Don't wrap trivial computations in `useMemo` just for appearances.
- `useCallback` only for handlers passed to memoized children, effect dependencies, or DataTable's `onPaginationChange`/`onColumnFiltersChange` props — not for every inline function.
- Never introduce `useState` for server data — Apollo's cache owns it. `useState` is only for genuinely local, ephemeral UI state (e.g. a dropdown's open/closed flag). Filter/page/search state belongs in the URL (`validateSearch` + Zod), not `useState`.
- Never put API calls or business logic inside a component body — extract to a `features/<x>/<x>.hooks.ts` hook.

#### Forms — strict RHF + Zod

- Every form: `useForm` + `zodResolver(schema)`, schema lives in `features/<x>/<x>.schema.ts`.
- `noValidate` on the `<form>`, `aria-invalid` on inputs, inline error `<p>` under each field — mirror an existing form in `src/components/forms/` (e.g. `CreateCustomerForm.tsx`).
- Zod is for form validation only — never used to parse/validate GraphQL responses.
- No `useState` mirroring individual field values; seed with `reset()` in a `useEffect` (deferred via `requestAnimationFrame` if strict-mode flags a sync `setState`).

#### Component architecture (atomic + shadcn)

- `atoms/` → pure visual, no hooks besides `useState`, no API calls.
- `molecules/` → composes 2–3 atoms, no direct API calls, callbacks via props.
- `organisms/` → may use feature hooks and Apollo hooks directly (e.g. `DataTable`).
- `forms/` → RHF + Zod only, per the rules above.
- Always reuse `src/components/organisms/DataTable.tsx` for any tabular data — never build a one-off table. Column defs (`ColumnDef<TData>[]`) live in the route file via `useMemo`; filter dropdown options go in `meta.filterOptions`, not inside `DataTable`.
- Use existing `src/components/ui/` (shadcn) primitives as the base for anything new — never hand-roll a control shadcn already provides, and never edit files inside `ui/` directly (re-run the shadcn CLI instead).

#### Theme conventions

- Never hardcode colors or use inline `style` — use Tailwind utility classes.
- Use the project's CSS custom properties for brand colors via the `bg-(--var)` / `text-(--var)` / `border-(--var)` syntax, e.g. `bg-(--sea-ink)`, `text-(--lagoon)`, `border-(--line)` (defined in [styles.css](../../../src/styles.css)). Don't invent new color tokens without checking `styles.css` first.
- Use `cn()` from `@/lib/utils` for conditional classes and `cva()` for variants (sizes, badge colors, etc.).

#### File naming

| Type         | Convention                                                               | Example                   |
| ------------ | ------------------------------------------------------------------------ | ------------------------- |
| Components   | PascalCase                                                               | `UserCard.tsx`            |
| Hooks        | camelCase, `use` prefix                                                  | `useUsers.ts`             |
| Schemas      | `<feature>.schema.ts`                                                    | `customers.schema.ts`     |
| Operations   | `<feature>.operations.ts`                                                | `customers.operations.ts` |
| Stores       | camelCase + `Store`                                                      | `authStore.ts`            |
| Types        | `<name>.types.ts`                                                        | `auth.types.ts`           |
| Pages/routes | PascalCase + `Page` for components; route files per TanStack conventions | `CustomersPage.tsx`       |

#### Filtering/URL state (if the feature has a list view)

- URL search params via `validateSearch` + Zod schema; boolean/enum filters go to the backend `FilterInput` (never client-side across pages); text search may stay client-side temporarily with a `TODO` comment.
- **Search inputs must be debounced before they trigger a query.** The raw input value can update the URL/local state immediately (so typing feels instant), but the value passed into the list's `FilterInput`/query variables must be debounced ~300ms first — otherwise every keystroke re-triggers the GraphQL query.
  - Custom filter panel with a plain `<Input>`: use `useDebounce` from `@/hooks/useDebounce` — `const debouncedQ = useDebounce(q, 300)`, then pass `debouncedQ.trim() || undefined` into the filter (see `products/index.tsx`, `resources/index.tsx`, `orders/index.tsx`, `rentals/index.tsx`).
  - Using `DataTable`'s built-in search box: pass `searchValue`/`onSearchChange` — `DataTable` already debounces (300ms) internally before calling `onSearchChange` (see `admins.tsx`, `customers/index.tsx`). Don't add a second `useDebounce` on top of this.

### 4. Verify before reporting done

- `pnpm lint` and `pnpm check` clean (or explicitly note any pre-existing unrelated failures).
- `pnpm codegen` and (if routes changed) `pnpm generate-routes` were run and their outputs are part of the change.
- No edits to `src/components/ui/` or `src/lib/gql/`.
- Confirm no package was added without the separate approval from Step 2/Hard Gate 2.

## Anti-patterns to catch and fix

- Writing code before the plan was approved, or before a new-package ask was separately approved.
- Hand-written GraphQL types, `gql` from `@apollo/client`, `useState` for server/filter/page state.
- One-off tables instead of `DataTable`, inline styles/hardcoded colors, new color tokens not in `styles.css`.
- `useMemo`/`useCallback` sprinkled everywhere regardless of need, or missing where DataTable/effect deps require referential stability.
- Adding a dependency to solve something shadcn/ui, radix-ui, or an already-installed package already solves.
- A search `<Input>` whose raw `onChange` value is passed straight into the query filter — always debounce first (see Filtering/URL state above).
