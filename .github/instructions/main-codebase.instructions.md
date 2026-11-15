# GitHub Copilot Instructions

## Project Overview

This repository contains the **LMS admin web application**. It is one of three separate projects, not a monorepo:

- `lms_admin` — admin web application (this repository)
- Backend — REST API in a separate repository
- Mobile app — student and instructor application in a separate repository; a web version may be developed later

Only make changes for the admin web application in this repository. Do not assume the backend, mobile app, or future student/instructor web app shares this repository's implementation or dependencies.

---

## Tech Stack

| Concern        | Library / Version                                              |
| -------------- | -------------------------------------------------------------- |
| Framework      | React 19 + TanStack Start (`@tanstack/react-start`)            |
| Language       | TypeScript — strict mode, zero `any` exceptions                |
| Build          | Vite                                                           |
| Styling        | Tailwind CSS v4 + shadcn/ui                                    |
| Data fetching  | REST API over HTTP; use the shared API client and route loaders |
| API protocol   | REST endpoints defined by the separate backend repository       |
| Validation     | Zod v4 — form validation                                         |
| Forms          | React Hook Form v7 + `@hookform/resolvers` (Zod resolver)      |
| Global state   | Zustand v4 — auth only; no server state                        |
| Routing        | TanStack Router v1 — file-based via `src/routes/`              |
| Component base | shadcn/ui — auto-generated, never edited manually              |
| Env vars       | `@t3-oss/env-core` — always via `src/env.ts`                   |

---

## Import Alias

The canonical internal alias is **`@/`** — use it for all internal imports:

```typescript
// ✅ Correct
import { env } from '@/env'
import { useAuthStore } from '@/store/authStore'
import { DataTable } from '@/components/organisms/DataTable'

// ❌ Avoid relative paths for cross-feature imports when the @/ alias is available
```

The `@/` alias resolves to `src/` and is the standard for internal imports.

---

## Folder Structure Rules

```
src/
├── components/
│   ├── ui/          # shadcn/ui only — NEVER suggest edits here
│   ├── atoms/       # Pure visual, no business logic, no API calls
│   ├── molecules/   # 2–3 atoms composed, minimal logic
│   ├── organisms/   # Complex reusable sections (DataTable, Sidebar, etc.)
│   └── forms/       # React Hook Form + Zod forms
├── features/        # Feature-scoped: *.api.ts, optional *.hooks.ts, *.schema.ts
├── lib/
│   ├── utils.ts     # Shared utilities such as cn()
│   └── apiClient.ts # Shared REST client configuration and HTTP handling
├── hooks/           # Shared generic hooks (usePagination, etc.)
├── store/           # Zustand stores only (authStore)
├── routes/          # TanStack Router file-based routes — this IS the page layer
├── types/           # Global TypeScript types (auth.types.ts, etc.)
├── env.ts           # ONLY place to access env vars — never import.meta.env directly
└── router.tsx       # TanStack Router setup
```

### Atomic Design Rules

- `atoms/` — No props drilling beyond 2 levels. No API calls. No hooks except `useState`.
- `molecules/` — Can use atoms. No direct API calls. Can accept callbacks as props.
- `organisms/` — Can use feature hooks and compose feature data into reusable sections.
- `routes/` — Route files ARE the page layer. Compose organisms here. Use `beforeLoad` for auth guards. No inline business logic.
  - Route code may run during server rendering. Do not access browser-only APIs such as `localStorage` on the server. Follow the selected authentication strategy for server-safe route guards.
- `forms/` — Always use React Hook Form + Zod resolver. Never use `@tanstack/react-form` — use `react-hook-form` only.

---

## TypeScript Rules — STRICTLY ENFORCED

```typescript
// ✅ ALWAYS use explicit return types on functions
const getUser = (id: string): Promise<User> => { ... }

// ✅ ALWAYS use 'import type' for type-only imports
import type { Course } from '@/features/courses/courses.api'

// ✅ ALWAYS use 'type' for object shapes
type UserCardProps = {
  user: User;
  onEdit: (id: string) => void;
};

// ✅ ALWAYS use 'unknown' in catch blocks, never 'any'
try { ... } catch (error: unknown) {
  if (error instanceof Error) console.error(error.message);
}

// ✅ USE 'satisfies' for config/constant objects
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard /> },
] satisfies NavItem[]

// ❌ NEVER use 'any' — suggest 'unknown' or a proper type instead
// ❌ NEVER use non-null assertion '!' — use optional chaining or a null check
// ❌ NEVER use @ts-ignore — use @ts-expect-error with a comment if truly needed
// ❌ NEVER use default exports — always named exports
// ❌ NEVER write inline type casting with 'as' unless absolutely necessary
```

---

## Component Rules

```typescript
// ✅ ALWAYS named exports
export const UserCard = ({ user, onEdit }: UserCardProps): React.ReactElement => { ... }

// ✅ ALWAYS define prop types above the component
type UserCardProps = {
  user: User;
  onEdit: (id: string) => void;
  className?: string; // optional className for style overrides
};

// ✅ USE cn() for conditional classNames
import { cn } from '@/lib/utils';
<div className={cn('base-class', isActive && 'active-class', className)} />

// ✅ USE cva() for component variants (button sizes, badge colors, etc.)
import { cva } from 'class-variance-authority';

// ✅ Route-level page components use regular function declarations (not arrow functions)
function CoursesPage(): React.ReactElement { ... }

// ❌ NEVER put business logic inside components — extract to hooks
// ❌ NEVER make REST requests directly inside components — use feature API modules and route loaders
// ❌ NEVER use default exports for components
// ❌ NEVER use React.FC type — use explicit return type React.ReactElement
```

---

## Form Rules

Always use React Hook Form with Zod resolver. Follow this exact HTML pattern:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormValues>({ resolver: zodResolver(schema) })

// ✅ Forms must have noValidate (disable browser validation — Zod handles it)
// ✅ Inputs must have aria-invalid for accessibility
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
  <div className="space-y-1.5">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      aria-invalid={errors.email ? 'true' : undefined}
      {...register('email')}
    />
    {errors.email && (
      <p className="text-[0.8rem] text-destructive">{errors.email.message}</p>
    )}
  </div>
</form>
```

---

## REST API Contract and Types

The backend REST API lives in a separate repository. Treat its documented endpoints and request/response shapes as the contract for this admin app; do not import backend source files into this repository.

- If the backend publishes an OpenAPI specification and a client or type generator is configured, use its generated request/response types. Do not edit generated output by hand.
- If no generated client is available, define explicit TypeScript request and response types alongside the feature API functions and keep them aligned with the backend contract.
- Do not assume a code-generation command or local backend URL exists. Add one only when the backend provides a suitable API specification and this repository configures the tooling.
- After adding or renaming routes, run `pnpm generate-routes` to regenerate the TanStack Router route tree.

---

## Feature Pattern — The Golden Rule

Keep each feature's REST requests and form validation in feature-scoped files. Use this pattern as a default; a feature does not need a custom hook file unless it has reusable hook logic.

```
features/
└── courses/
    ├── courses.api.ts       # Typed REST requests for course endpoints
    ├── courses.hooks.ts     # Optional reusable React hooks
    └── courses.schema.ts    # Zod schemas for form validation
```

```typescript
// courses.api.ts — feature-specific REST request functions
// Example assumes a shared API client is available for base URL, auth, and HTTP errors.
import { apiClient } from '@/lib/apiClient'

export type Course = {
  id: string
  title: string
  status: string
}

export type ListCoursesParams = {
  page: number
  pageSize: number
  status?: string
}

export type ListCoursesResponse = {
  items: Array<Course>
  totalCount: number
}

export const listCourses = (
  params: ListCoursesParams,
): Promise<ListCoursesResponse> => apiClient.get('/courses', { params })

export const getCourse = (id: string): Promise<Course> =>
  apiClient.get(`/courses/${encodeURIComponent(id)}`)
```

`courses.hooks.ts` is optional; add it only when reusable React hook behavior is needed.
This repo does not currently include a query/cache library. Prefer TanStack Router
loaders or Start server functions for route data unless the project adopts one.

```typescript
// courses.schema.ts — Zod schemas for form input validation
import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
})

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>
```

> **Rules:**
>
> - Define request and response types from the REST contract. Prefer generating them from the backend's OpenAPI specification when available; otherwise maintain them to match that contract.
> - Keep HTTP calls in feature API modules and route data loading in TanStack Router loaders or Start server functions. Do not issue requests directly from route components.
> - Use REST paths and query parameters that the backend supports; for example, list filters and pagination belong in the request query string and must be applied server-side.
> - Use the shared API client for base URL, authentication, and consistent error handling. Surface request errors; do not silently return empty or success-shaped fallback data.
> - After a mutation, refresh or invalidate affected data using the project's chosen data-loading approach.
> - Do not add a query/cache library solely to follow this pattern. If one is adopted, document its conventions and use it consistently.
> - Use Zod for form validation. Do not assume REST response types are generated or runtime-validated unless the project explicitly adopts an OpenAPI client or response-validation strategy.

---

## Import Order — Always in This Order

```typescript
// 1. Node built-ins (rare in frontend)
import path from 'node:path'

// 2. External packages
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// 3. Internal aliases (@/)
import { apiClient } from '@/lib/apiClient'
import type { Course } from '@/features/courses/courses.api'

// 4. Relative imports
import { UserCard } from './UserCard'
```

---

## Zod Rules

Use Zod for form validation. REST response validation is optional and should be added only when runtime validation is required by the API boundary.

```typescript
// ✅ USE Zod schemas in features/*.schema.ts for form validation
// ✅ USE z.string().min(1) — z.string().nonempty() was removed in Zod v4
// ✅ USE z.object({}) for shapes; add .strict() when you want to disallow unknown keys
// ✅ USE z.enum([]) for dropdown/select options
// ✅ Add runtime REST response validation only when required by the API boundary
// ❌ NEVER use z.any()
```

---

## Tailwind + shadcn/ui Rules

```typescript
// ✅ USE shadcn/ui components as base — never build from scratch what shadcn has
// ✅ USE cn() from '@/lib/utils' for merging classes
// ✅ USE cva() for component variants
// ✅ ALWAYS sort Tailwind classes (Prettier plugin handles this automatically)
// ✅ USE CSS variables for custom colors: bg-(--sea-ink), text-(--lagoon), border-(--line)
// ❌ NEVER edit files inside src/components/ui/ — re-run shadcn CLI instead
// ❌ NEVER use inline styles — use Tailwind classes
// ❌ NEVER hardcode colors — use CSS variables defined in styles.css
```

---

## State Management Rules

```typescript
// ✅ Load server data through REST API modules and TanStack Router loaders/server functions
// ✅ Use a query/cache library only if the project explicitly adopts one
// ✅ Use client state stores only for genuinely shared client state
// ✅ USE useState for local component state only
// ❌ Do not duplicate server data in a global client-state store
// ❌ Do not make REST requests directly from UI components; use feature API modules
```

---

## Environment Variables

If `src/env.ts` is configured, access environment variables through it rather than using `import.meta.env` throughout the app.

```typescript
// ✅ CORRECT
import { env } from '@/env'
const url = env.VITE_API_BASE_URL

// ❌ Avoid scattering direct environment access across features
const url = import.meta.env.VITE_API_BASE_URL
```

Configure only the variables this app actually needs, such as the REST API base URL. Never put secrets in client-exposed environment variables.

Use a shared REST client in `src/lib/apiClient.ts` for API base URL, headers, credentials, and consistent HTTP error handling. Keep `src/router.tsx` focused on router setup; do not initialize an API data client there.

---

## Auth

Implement authentication according to the backend REST API contract. Do not assume endpoint names, token format, refresh behavior, roles, or storage strategy.

- Use the backend's documented login, logout, and refresh endpoints.
- Attach credentials through the shared REST client according to the backend's authentication scheme.
- Keep secrets out of URLs and logs. Choose cookie or token storage based on the agreed security design; do not assume browser storage is safe or available during server rendering.
- Handle unauthorized responses and refresh failures explicitly. Clear local auth state and navigate to login when the session is no longer valid.
- Use TanStack Router `beforeLoad` for admin route guards. Guards improve navigation UX but do not replace backend authorization.
- The backend must enforce roles and permissions for every protected REST endpoint. Do not assume student/instructor roles belong in this admin app.

### Route Guards

Use TanStack Router `beforeLoad` — **never use React component wrappers as route guards**:

```typescript
// src/routes/_admin.tsx — layout route, guards all admin routes
export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    // Verify the session with the app's server-safe auth helper.
    // Redirect to the login route when no valid session exists.
  },
  component: AdminLayout,
})
```

Do not hardcode role names or authorization rules in shared instructions. Follow the backend's documented admin roles and permissions, and treat backend authorization as authoritative.

Logout and refresh flows must call the documented REST endpoints. Clear local session state even when a logout request fails, while surfacing unexpected errors according to the app's error-handling conventions.

---

## Routing

### File-based routing conventions

TanStack Router uses the file tree inside `src/routes/` as the route tree. After adding or renaming routes, run:

```bash
pnpm generate-routes  # regenerates src/routeTree.gen.ts
```

Route file naming:

| File                                      | Resulting URL                               |
| ----------------------------------------- | ------------------------------------------- |
| `routes/index.tsx`                        | `/`                                         |
| `routes/login.tsx`                        | `/login`                                    |
| `routes/_admin.tsx`                       | Layout route — wraps all `/_admin/*` routes |
| `routes/_admin/dashboard.tsx`             | `/dashboard`                                |
| `routes/_admin/courses/index.tsx`       | `/courses`                                |
| `routes/_admin/courses/$courseId.tsx` | `/courses/:courseId`                    |

- Prefix a route file with `_` (e.g. `_admin.tsx`) to make it a **layout route** — it renders an `<Outlet />` and applies shared UI + auth guards.
- Use `$paramName` in filenames for dynamic segments.

### Reading route params and search params

```typescript
// Dynamic segment
const { courseId } = Route.useParams()

// Search params (URL query string) — always declare with validateSearch + Zod
const { q, page, isActive } = Route.useSearch()
```

---

## Testing

Test files are **co-located** with their source file using the `.test.tsx` / `.test.ts` suffix.

```typescript
// ✅ Co-locate tests next to source
src / components / atoms / CopyButton.test.tsx
src / features / courses / courses.api.test.ts

// ✅ Mock the REST client when testing API functions; use renderHook for hooks
import { renderHook } from '@testing-library/react'

// ✅ Test behaviour, not implementation details
// ❌ No snapshot tests
// ❌ Never test files inside src/components/ui/ — those are shadcn, not ours
```

---

## File Naming Conventions

| Type       | Convention                    | Example               |
| ---------- | ----------------------------- | --------------------- |
| Components | PascalCase                    | `UserCard.tsx`        |
| Hooks      | camelCase with 'use' prefix   | `useUsers.ts`         |
| Schemas    | camelCase with feature prefix | `users.schema.ts`     |
| API modules | camelCase with feature prefix | `users.api.ts` |
| Stores     | camelCase with 'Store' suffix | `authStore.ts`        |
| Utils      | camelCase                     | `utils.ts`            |
| Types      | camelCase with `.types.ts`    | `common.types.ts`     |
| Constants  | camelCase                     | `constants.ts`        |
| Pages      | PascalCase with 'Page' suffix | `UsersPage.tsx`       |

---

## What Copilot Should NEVER Do

- ❌ Never suggest `any` type — always suggest a proper type or `unknown`
- ❌ Never suggest default exports
- ❌ Never edit `src/components/ui/` files — these are shadcn auto-generated
- ❌ Never put REST requests directly in UI components — use feature API modules
- ❌ Never hand-write types that duplicate a configured generated OpenAPI contract
- ❌ Never suggest class components — functional components only
- ❌ Never use `React.FC` type — use explicit return type `React.ReactElement`
- ❌ Never create new files outside the defined folder structure
- ❌ Never use `@tanstack/react-form` — forms must use React Hook Form + `@hookform/resolvers`
- ❌ Never duplicate REST server data in a global client-state store
- ❌ Never access `import.meta.env` directly — always import from `@/env`
- ❌ Never use a React component as a route guard — use TanStack Router `beforeLoad` only
- ❌ Never create a `pages/` folder — `src/routes/` is the page layer

---

## DataTable — `src/components/organisms/DataTable.tsx`

`DataTable<TData>` is the single reusable table organism. **Never build a one-off table layout in a route file.** Always use this component.

### Key props

| Prop                                                     | Purpose                                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data`                                                   | Already-filtered rows to render                                                                        |
| `columns`                                                | `ColumnDef<TData>[]` — define columns in the route file via `useMemo`                                  |
| `pageIndex` / `pageSize` / `totalCount`                  | Server-side pagination state (0-based index)                                                           |
| `onPaginationChange`                                     | Called when user navigates pages                                                                       |
| `hasNextPage`                                            | Drives "next" button; derive it from the REST pagination response                                      |
| `columnFilters` / `onColumnFiltersChange`                | **Controlled** — pass both when filters must be persisted (URL)                                        |
| `searchValue` / `onSearchChange`                         | Debounced (300 ms) text search input in the toolbar                                                    |
| `toolbar`                                                | `ReactNode` slot rendered to the right of the search box — use for refresh buttons, date pickers, etc. |
| `loading` / `emptyMessage` / `rowClassName` / `getRowId` | Standard UI helpers                                                                                    |

### Column filter dropdown (the `ListFilter` icon in column headers)

`DataTable` renders a `ColumnFilterDropdown` icon inside any column header that has `meta.filterOptions`. The dropdown shows a portal-based panel with check/X marks — completely internal to `DataTable`.

To enable it on a column, add `meta.filterOptions` to the column definition:

```typescript
{
  accessorKey: 'isActive',
  header: 'Status',
  enableColumnFilters: true,
  filterFn: (row, columnId, filterValue: unknown[]) => {
    if (!filterValue.length) return true;
    return filterValue.includes(row.getValue(columnId));
  },
  meta: {
    filterOptions: [
      { label: 'Active', value: true },
      { label: 'Inactive', value: false },
    ],
  },
  cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
},
```

`DataTable` is generic — it knows nothing about "status" or "isActive". The filter options are defined entirely in the route file's column definitions.

---

## Filtering Strategy

When a REST endpoint supports server-side filtering, use this three-layer architecture:

```
URL search params  →  REST query parameters  →  Backend filtering
     (Zod)                 (API request)          (database query)
```

### Layer 1 — URL search params (TanStack Router `validateSearch`)

Every page with filterable data MUST persist filter state in the URL using `validateSearch` with a Zod schema. This gives free back/forward navigation, shareable links, and refresh persistence.

```typescript
const adminsSearchSchema = z.object({
  q: z.string().optional(), // text search
  page: z.number().int().min(1).optional(), // current page (omit when 1)
  status: z.boolean().optional(), // column filter; undefined = all
})

export const Route = createFileRoute('/_admin/admins')({
  validateSearch: adminsSearchSchema,
  component: AdminsPage,
})
```

After adding `validateSearch`, re-run the router generator: `pnpm generate-routes`.

### Layer 2 — Controlled column filters bridging URL → DataTable

The route reads URL params, derives `ColumnFiltersState`, and passes it as a **controlled prop** to `DataTable`. When the user interacts with a column filter dropdown, `onColumnFiltersChange` fires and the route writes the new value back to the URL — resetting `page` to 1.

```typescript
// Derive controlled column filters from URL
const columnFilters: ColumnFiltersState = useMemo(
  () =>
    statusFilter === undefined
      ? []
      : [{ id: 'isActive', value: [statusFilter] }],
  [statusFilter],
)

const handleColumnFiltersChange = useCallback(
  (filters: ColumnFiltersState): void => {
    const entry = filters.find((f) => f.id === 'isActive')
    const values = entry?.value as boolean[] | undefined
    const newStatus = values?.length === 1 ? values[0] : undefined
    setSearch({ status: newStatus, page: undefined })
  },
  [setSearch],
)
```

### Layer 3 — Server-side filtering via REST

Pass URL filter values to the feature API function as query parameters supported by the REST endpoint. The backend must filter across the full dataset before paginating.

```typescript
// ✅ Pass filters to the REST endpoint so it filters before pagination
const courses = await listCourses({
  page,
  pageSize: PAGE_SIZE,
  status: statusFilter,
})
```

> **Critical rule:** Do NOT filter with `getFilteredRowModel` + client-side `filterFn` for data that spans multiple pages. A client-side filter only sees the current page's rows. Push supported status and enum filters to the REST endpoint; client-side filtering is only appropriate when the complete dataset is intentionally loaded.

### Text search

Use server-side text search when the REST endpoint supports it. If it does not, only filter client-side when the full intended dataset is loaded; do not imply that filtering one page provides complete search results. Add a search field to the API request type only when the endpoint contract supports it.

### The `setSearch` merge helper pattern

Every route with URL-persisted filters should use a `setSearch` helper to avoid boilerplate:

```typescript
const searchParams = Route.useSearch()
const navigate = useNavigate()

const setSearch = useCallback(
  (patch: Partial<typeof searchParams>): void => {
    void navigate({ search: (prev) => ({ ...prev, ...patch }) })
  },
  [navigate, searchParams],
)

// Usage:
setSearch({ status: true, page: undefined }) // filter active, reset to page 1
setSearch({ page: 3 }) // go to page 3, keep other params
```

### Rules summary

```
// ✅ Always persist filter/page/search state in URL via validateSearch + Zod
// ✅ Pass filters to REST query parameters supported by the backend endpoint
// ✅ Use controlled columnFilters prop on DataTable when filters must survive navigation
// ✅ Reset page to 1 (undefined in URL) whenever any filter changes
// ✅ Use server-side text search when the REST endpoint supports it
// ✅ Column filter options (filterOptions in meta) are defined in the route, not in DataTable
// ❌ Never use getFilteredRowModel for multi-page data — client can only see one page at a time
// ❌ Never hardcode filter UI inside DataTable — it must stay generic
// ❌ Never store filter state in useState when it should be in the URL
```
