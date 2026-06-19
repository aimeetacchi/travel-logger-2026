# Authentication

## Provider: Clerk

This app uses **Clerk** for all authentication. Do not implement custom auth, use NextAuth, or add any other auth library.

Clerk is installed as `@clerk/nextjs`. The root layout wraps the entire app in `<ClerkProvider>`.

## Middleware

All routes are protected by Clerk's middleware via `proxy.ts` (the project's middleware file). It uses `clerkMiddleware()` with no custom route matching logic — Clerk handles protection at the middleware layer.

```ts
// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

Do not add manual redirect logic for unauthenticated users in pages or layouts. The middleware handles this.

## Getting the current user (server-side)

Use Clerk's `auth()` from `@clerk/nextjs/server` to resolve the current user inside Server Components, data helpers, and Server Actions.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthenticated");
```

- Always `await auth()` — it returns a Promise in this version of `@clerk/nextjs`
- Always guard with a `!userId` check immediately after — never proceed with a nullable `userId`
- **Never accept `userId` as a parameter from a caller.** Always derive it from `auth()` so callers cannot spoof it

See `/docs/data-fetching.md` for how this applies to database queries.

## UI components

Clerk provides pre-built components. Use them — do not build custom sign-in/sign-up forms.

| Use case | Component | Import |
|---|---|---|
| Full sign-in page | `<SignIn />` | `@clerk/nextjs` |
| Full sign-up page | `<SignUp />` | `@clerk/nextjs` |
| Sign-in trigger (modal) | `<SignInButton mode="modal">` | `@clerk/nextjs` |
| Sign-up trigger (modal) | `<SignUpButton mode="modal">` | `@clerk/nextjs` |
| User avatar / account menu | `<UserButton />` | `@clerk/nextjs` |
| Conditional rendering | `<Show when="signed-in">` / `<Show when="signed-out">` | `@clerk/nextjs` |

### Sign-in and sign-up pages

Dedicated pages live at `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`. The catch-all segment is required for Clerk's hosted UI to function correctly.

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

### Conditional rendering

Use `<Show>` to conditionally render UI based on auth state. Do not use `useUser()` or `useAuth()` hooks for conditional rendering in layouts.

```tsx
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

<Show when="signed-in">
  <UserButton />
</Show>
<Show when="signed-out">
  <SignInButton mode="modal" />
</Show>
```

## Server Actions

Every Server Action that touches user data must verify auth internally — Server Actions are reachable via direct POST requests.

```ts
"use server";

import { auth } from "@clerk/nextjs/server";

export async function logPlace(data: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  // proceed with userId
}
```

## What not to do

- Do not use `getAuth()` (deprecated) — use `auth()` from `@clerk/nextjs/server`
- Do not use `useUser()` or `useAuth()` hooks for data access — hooks are client-side only and cannot be used in Server Components
- Do not pass `userId` as a prop or function argument to data helpers
- Do not write custom session handling, JWT verification, or cookie-based auth
- Do not create API route handlers (`app/api/...`) for auth callbacks — Clerk handles this automatically
