# Data Mutations

## Rule: `/data` helpers only

**ALL database writes must go through helper functions in the `/data` directory.** Direct Drizzle calls outside of `/data` are not allowed.

- One helper per logical operation (e.g. `createPlace`, `updatePlace`, `deletePlace`)
- Helper functions are plain async functions — no framework magic, no decorators
- Use Drizzle ORM — do NOT write raw SQL

```
/data
  places.ts       # helpers for places reads and writes
  ...
```

## Rule: Always scope mutations to the current user

**Every write helper MUST resolve the authenticated user via Clerk's `auth()` and scope the operation to that user.** A user must never be able to mutate another user's data.

- Call `auth()` inside every write helper — never accept a `userId` parameter from the caller
- Throw if no user is authenticated — never fall through to an unscoped write
- For updates and deletes, filter by both the record ID **and** `userId` so a user cannot target records they do not own

```ts
// data/places.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { places } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function createPlace(input: NewPlace) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  return db.insert(places).values({ ...input, userId }).returning();
}

export async function deletePlace(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  return db.delete(places).where(and(eq(places.id, id), eq(places.userId, userId)));
}
```

## Rule: Server Actions via colocated `actions.ts`

**ALL mutations triggered from the UI must use Server Actions defined in a colocated `actions.ts` file** — not Route Handlers, not inline `'use server'` functions inside components.

File placement: put `actions.ts` next to the page or component that uses it.

```
app/
  places/
    page.tsx
    actions.ts    ← server actions for this route
```

Every `actions.ts` file must start with `'use server'` at the top.

## Rule: Type parameters — no `FormData`

**Server Action parameters must be typed with explicit TypeScript types.** Do NOT use `FormData` as a parameter type.

```ts
// ✗ wrong
export async function createPlace(formData: FormData) { ... }

// ✓ correct
export async function createPlace(input: CreatePlaceInput) { ... }
```

## Rule: Validate inputs with Zod

**Every Server Action MUST validate its arguments with Zod before doing anything else.** Do not trust caller-supplied data.

- Define a Zod schema at the top of the file alongside the action
- Parse with `.parse()` (throws on failure) or `.safeParse()` if you want to return structured errors
- Validation runs before any auth check or DB call is not necessary — but validation must always happen

## End-to-end example

**`data/places.ts`** — write helpers scoped to the current user

```ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { places } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export type NewPlace = {
  country: string;
  city?: string;
  description?: string;
  visitedOn: string;
  favourite?: boolean;
};

export async function createPlace(input: NewPlace) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  const [place] = await db.insert(places).values({ ...input, userId }).returning();
  return place;
}

export async function deletePlace(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  await db.delete(places).where(and(eq(places.id, id), eq(places.userId, userId)));
}
```

**`app/places/actions.ts`** — Server Actions that validate, then delegate to `/data` helpers

```ts
'use server';

import { z } from 'zod';
import { createPlace, deletePlace } from '@/data/places';

const CreatePlaceSchema = z.object({
  country: z.string().min(1),
  city: z.string().optional(),
  description: z.string().optional(),
  visitedOn: z.string().date(),
  favourite: z.boolean().optional(),
});

const DeletePlaceSchema = z.object({
  id: z.string().uuid(),
});

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;

export async function createPlaceAction(input: CreatePlaceInput) {
  const validated = CreatePlaceSchema.parse(input);
  return createPlace(validated);
}

export async function deletePlaceAction(input: { id: string }) {
  const { id } = DeletePlaceSchema.parse(input);
  return deletePlace(id);
}
```

**`components/add-place-form.tsx`** — Client Component that calls the action

```tsx
'use client';

import { createPlaceAction } from '@/app/places/actions';

export function AddPlaceForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    await createPlaceAction({
      country: form.country.value,
      city: form.city.value || undefined,
      visitedOn: form.visitedOn.value,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Rule: No `redirect()` in Server Actions — redirect client-side

**Never call `redirect()` from within a Server Action.** Redirects must be handled client-side after the Server Action resolves.

```ts
// ✗ wrong — redirect() inside a Server Action
export async function createPlaceAction(input: CreatePlaceInput) {
  const validated = CreatePlaceSchema.parse(input);
  const place = await createPlace(validated);
  redirect(`/places/${place.id}`); // ← do not do this
}

// ✓ correct — action returns, client redirects
export async function createPlaceAction(input: CreatePlaceInput) {
  const validated = CreatePlaceSchema.parse(input);
  return createPlace(validated);
}
```

```tsx
// ✓ correct — client component redirects after the action resolves
'use client';

import { useRouter } from 'next/navigation';
import { createPlaceAction } from './actions';

export function AddPlaceForm() {
  const router = useRouter();

  async function handleSubmit(input: CreatePlaceInput) {
    const place = await createPlaceAction(input);
    router.push(`/places/${place.id}`);
  }
}
```

## Summary

| Where to write mutation logic | Allowed? |
|---|---|
| `/data` helper via Drizzle ORM | yes |
| Raw SQL | no |
| Direct DB call outside `/data` | no |
| Inside a Server Action directly | no — delegate to `/data` |

| Server Action rules | Required? |
|---|---|
| Defined in colocated `actions.ts` | yes |
| File starts with `'use server'` | yes |
| Parameters typed (no `FormData`) | yes |
| Arguments validated with Zod | yes |
| Auth resolved inside `/data` helper | yes |
| `redirect()` called inside action | no — redirect client-side after action resolves |
