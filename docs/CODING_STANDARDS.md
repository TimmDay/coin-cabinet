# Coding Standards & Best Practices

This document outlines the coding standards and best practices for the Coin Cabinet project to ensure consistent, maintainable, and high-quality code.

## TypeScript & ESLint Rules

Lint enforces these, so they are not repeated here: `??` over `||` (strings are exempt, so `""` falls through on purpose), optional chains, `type` over `interface`, no `any`, no inferrable annotations, and no semicolons. Run `pnpm check`.

### 1. Function Declarations

**Rule:** Prefer `function` keyword over arrow functions for top-level function definitions.

```typescript
// ✅ Good - Function declarations for top-level functions
function processCoin(coin: CoinData): string {
  return coin.nickname
}

function calculateDiameter(coin: CoinData): number {
  return coin.diameter ?? 0
}

// ✅ Good - Arrow functions for callbacks, event handlers, and inline functions
const coins = data.map((coin) => processCoin(coin))
const handleClick = (event: React.MouseEvent) => {
  // handle click
}

// ❌ Bad - Arrow functions for top-level function definitions
const processCoin = (coin: CoinData): string => {
  return coin.nickname
}
```

### 2. ARIA Attributes

**Rule:** ARIA attributes must use string values, not boolean expressions.

```typescript
// ✅ Good
<button aria-expanded={isOpen ? "true" : "false"}>
  Toggle Menu
</button>

// ❌ Bad
<button aria-expanded={isOpen}>
  Toggle Menu
</button>
```

## Component Patterns

### 1. Props Type Definition

Always define a `type` for component props:

```typescript
type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary"
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  // component logic
}
```

### 2. Event Handlers

Use proper event typing:

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  // handle click
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value)
}
```

### 3. Form Validation

Use consistent patterns for form validation:

```typescript
// Use react-hook-form with Zod schemas
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
})

type FormData = z.infer<typeof schema>

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // form logic
}
```

## File Organization

### 1. Import Order

```typescript
// 1. React and third-party libraries
import React from "react"
import { useQuery } from "@tanstack/react-query"

// 2. Internal utilities and hooks
import { cn } from "~/lib/utils"
import { useViewport } from "~/hooks/useViewport"

// 3. Components
import { Button } from "~/components/ui/Button"

// 4. Types (with type import)
import type { CoinData } from "~/types/coin"
```

### 2. Component Structure

```typescript
// 1. Imports
import React from "react"

// 2. Types
type ComponentProps = {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Event handlers
  const handleClick = () => {
    // handler logic
  }

  // 6. Effects
  useEffect(() => {
    // effect logic
  }, [])

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Error Handling

### 1. API Calls

The site reads through its own `/api` routes (see `READ_PATH.md`). Do not write
a new `fetch` with its own error handling:

- **Client:** build a list hook with `createPublicQuery` and fetch a single
  resource with `fetchPublic` (`src/api/public-query.ts`). Both unwrap the
  `{ success, data }` envelope and throw a `PublicFetchError` that carries the
  status, so `404` can be told apart from a failure.
- **Server:** write a route as `publicRoute(label, load, { cache })`
  (`src/app/api/_lib/public-route.ts`). Never put a database error in a response
  body: `publicRoute` logs it and sends a fixed message. Throw a
  `PublicRouteError` for a failure the visitor may be told about, such as a bad
  id.

```typescript
// Client
export const useMints = createPublicQuery<Mint[]>({
  key: ["mints"],
  path: "/api/mints",
  label: "mints",
  staleTime: STALE.week,
})

// Server
export const GET = publicRoute("mints", fetchMints)
```

### 2. Component Error Boundaries

Use error boundaries for better user experience:

```typescript
import { ErrorBoundary } from "react-error-boundary"

const ErrorFallback = ({ error }: { error: Error }) => (
  <div role="alert">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
  </div>
)

// Wrap components that might throw
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Performance Best Practices

### 1. Memoization

```typescript
// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Use useCallback for event handlers in child components
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id)
  },
  [onItemClick],
)
```

### 2. Code Splitting

```typescript
// Lazy load components that aren't immediately needed
const LazyComponent = lazy(() => import("./LazyComponent"))

// Use Suspense for loading states
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## Testing Guidelines

### 1. Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("should render with correct label", () => {
    render(<Button label="Click me" onClick={() => {}} />)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should call onClick when clicked", () => {
    const handleClick = jest.fn()
    render(<Button label="Click me" onClick={handleClick} />)

    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Accessibility (a11y)

### 1. Semantic HTML

```typescript
// ✅ Good - Use semantic HTML elements
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>
```

### 2. ARIA Labels

```typescript
// ✅ Good - Descriptive ARIA labels
<button
  aria-label="Close dialog"
  aria-expanded={isOpen ? "true" : "false"}
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</button>

<input
  type="text"
  aria-describedby="email-help"
  aria-invalid={hasError ? "true" : "false"}
/>
<div id="email-help">Enter your email address</div>
```

## Common Anti-Patterns to Avoid

1. **Using `any` type**: Always define proper types
2. **Inline styles**: Use Tailwind CSS classes or CSS modules
3. **Mutating props**: Props should be treated as read-only
4. **Direct DOM manipulation**: Use React state and refs
5. **Missing error boundaries**: Wrap components that might fail
6. **Ignoring TypeScript errors**: Fix all TypeScript errors, don't use `@ts-ignore`
7. **Not using keys in lists**: Always provide unique keys for list items
8. **Side effects in render**: Use useEffect for side effects

## Enforcement

- **ESLint** (`eslint.config.js`): strict TypeScript and React rules.
- **TypeScript**: strict mode. `pnpm check` runs lint and the type check; run it
  before opening a PR.
- **Prettier** (`prettier.config.js`): `semi: false` and the Tailwind class
  sorting plugin.
- **Vitest**: `pnpm test:run`.

- **Pre-commit** (`.husky/pre-commit`): lint-staged runs eslint and prettier on
  staged files, then `pnpm typecheck`. `pnpm install` wires it up.
- **CI** (`.github/workflows/ci.yml`): `pnpm check` and `pnpm test:run` on every
  PR and push to `main`. Prettier is not in CI yet; `pnpm format:check` fails on
  a few existing files.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Patterns](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
