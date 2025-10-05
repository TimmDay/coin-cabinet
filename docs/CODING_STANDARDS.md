# Coding Standards & Best Practices

This document outlines the coding standards and best practices for the Coin Cabinet project to ensure consistent, maintainable, and high-quality code.

## TypeScript & ESLint Rules

### 1. Nullish Coalescing (`??`) vs Logical OR (`||`)

**Rule:** Use `??` when you specifically want to handle `null` or `undefined`, use `||` when you want to handle all falsy values.

```typescript
// ✅ Good - Use ?? for null/undefined checks
const userName = user.name ?? "Anonymous";
const config = userConfig ?? defaultConfig;

// ✅ Good - Use || for falsy checks (empty strings, 0, false, null, undefined)
const isValid = !imageLink || imageLink.trim() === "";
const hasContent = title || description || image;

// ❌ Bad - Using || when only null/undefined should be handled
const userName = user.name || "Anonymous"; // This treats empty string as falsy too
```

### 2. Optional Chains (`?.`)

**Rule:** Use optional chaining instead of manual null checks.

```typescript
// ✅ Good
if (user?.profile?.preferences?.theme) {
  // handle theme
}

const email = user?.contact?.email;

// ❌ Bad
if (
  user &&
  user.profile &&
  user.profile.preferences &&
  user.profile.preferences.theme
) {
  // handle theme
}
```

### 3. Type Definitions

**Rule:** Prefer `type` over `interface` for type definitions.

```typescript
// ✅ Good - Use type for type definitions
type CoinData = {
  id: number;
  nickname: string;
  denomination: string;
  image_link_o: string | null;
  image_link_r: string | null;
};

// ❌ Bad - Using interface when type is more appropriate
interface CoinData {
  id: number;
  nickname: string;
  denomination: string;
  image_link_o: string | null;
  image_link_r: string | null;
}
```

**Note:** Use `interface` only when you need declaration merging or extending classes.

### 4. Function Declarations

**Rule:** Prefer `function` keyword over arrow functions for top-level function definitions.

```typescript
// ✅ Good - Function declarations for top-level functions
function processCoin(coin: CoinData): string {
  return coin.nickname;
}

function calculateDiameter(coin: CoinData): number {
  return coin.diameter ?? 0;
}

// ✅ Good - Arrow functions for callbacks, event handlers, and inline functions
const coins = data.map((coin) => processCoin(coin));
const handleClick = (event: React.MouseEvent) => {
  // handle click
};

// ❌ Bad - Arrow functions for top-level function definitions
const processCoin = (coin: CoinData): string => {
  return coin.nickname;
};
```

### 5. Type Safety

**Rule:** Avoid `any` types. Define proper types.

```typescript
// ✅ Good
function processCoin(coin: CoinData): string {
  return coin.nickname;
}

// ❌ Bad
function processCoin(coin: any): string {
  return coin.nickname; // No type safety
}
```

### 4. ARIA Attributes

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

### 5. Boolean Type Inference

**Rule:** Don't explicitly type obvious boolean values.

```typescript
// ✅ Good
const isValid = true;
const checkStatus = (enabled = false) => { ... };

// ❌ Bad
const isValid: boolean = true;
const checkStatus = (enabled: boolean = false) => { ... };
```

### 6. Semicolons

**Rule:** Do not use semicolons at the end of statements in TypeScript.

```typescript
// ✅ Good - No semicolons
const userName = user.name ?? "Anonymous";
const result = processData(input);

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

if (isValid) {
  handleSuccess();
}

// ❌ Bad - Using semicolons
const userName = user.name ?? "Anonymous";
const result = processData(input);

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

if (isValid) {
  handleSuccess();
}
```

**Note:** This rule applies to TypeScript/JavaScript files. Semicolons may still be required in specific contexts (e.g., immediately invoked function expressions, or when a line starts with `[` or `(`).

## Component Patterns

### 1. Props Interface Definition

Always define proper TypeScript interfaces for component props:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  // component logic
};
```

### 2. Event Handlers

Use proper event typing:

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // handle click
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### 3. Form Validation

Use consistent patterns for form validation:

```typescript
// Use react-hook-form with Zod schemas
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // form logic
};
```

## File Organization

### 1. Import Order

```typescript
// 1. React and third-party libraries
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal utilities and hooks
import { cn } from "~/lib/utils";
import { useAuth } from "~/hooks/useAuth";

// 3. Components
import { Button } from "~/components/ui/Button";

// 4. Types (with type import)
import type { CoinData } from "~/types/coin";
```

### 2. Component Structure

```typescript
// 1. Imports
import React from "react";

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // handler logic
  };

  // 6. Effects
  useEffect(() => {
    // effect logic
  }, []);

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

## Error Handling

### 1. API Calls

```typescript
// ✅ Good - Proper error handling
const fetchData = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/data");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as ApiResponse;

    if (!result.success) {
      throw new Error(result.message ?? "Unknown error occurred");
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};
```

### 2. Component Error Boundaries

Use error boundaries for better user experience:

```typescript
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error }: { error: Error }) => (
  <div role="alert">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
  </div>
);

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
  return heavyCalculation(data);
}, [data]);

// Use useCallback for event handlers in child components
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick],
);
```

### 2. Code Splitting

```typescript
// Lazy load components that aren't immediately needed
const LazyComponent = lazy(() => import("./LazyComponent"));

// Use Suspense for loading states
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## Testing Guidelines

### 1. Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with correct label", () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
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

These standards are enforced through:

- **ESLint**: Configured with strict rules for TypeScript and React
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks to run linting and tests
- **CI/CD**: Build pipeline fails if linting errors exist

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Patterns](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
