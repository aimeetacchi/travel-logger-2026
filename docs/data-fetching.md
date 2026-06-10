# Data Fetching

## Rule: Server Components only

**ALL data fetching must happen in Server Components.** No exceptions.

- Do NOT fetch data in Client Components (`'use client'`)
- Do NOT fetch data in Route Handlers (`app/api/...`)
- Do NOT use `useEffect` + `fetch` or SWR or React Query
- Do NOT call data helpers from Client Components

If a component needs data, it must either be a Server Component itself, or receive data as props passed down from a Server Component ancestor.

## Rule: Drizzle ORM via `/data` helpers only

**ALL database queries must go through helper functions in the `/data` directory.** Direct database access outside of `/data` is not allowed.

- Use Drizzle ORM — do NOT write raw SQL
- One helper function per logical query (e.g. `getUserTrips`, `getTripById`)
- Helper functions are plain async functions — no framework magic, no decorators

```
/data
  trips.ts       # helpers for trip queries
  destinations.ts
  ...
```

## Rule: Always scope queries to the current user

**Every query that returns user data MUST filter by the authenticated user's ID.** A logged-in user must never be able to read, write, or infer another user's data.

- Resolve the current user inside every helper using Clerk's `auth()` (server-side)
- Throw or return `null` / empty array if no user is authenticated — never fall through to an unscoped query
- **Never accept a `userId` as a parameter from the caller** — always derive it from `auth()` inside the helper so callers cannot spoof it

```ts
// data/trips.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserTrips() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  return db.select().from(trips).where(eq(trips.userId, userId));
}
```

## End-to-end example

This shows the full flow from `/data` helper → Server Component page → Client Component for interactivity.

**`data/trips.ts`** — query scoped to the current user

```ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserTrips() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  return db.select().from(trips).where(eq(trips.userId, userId));
}
```

**`app/trips/page.tsx`** — Server Component that fetches and passes data down

```tsx
import { getUserTrips } from '@/data/trips';
import { TripList } from '@/components/trip-list';

export default async function TripsPage() {
  const trips = await getUserTrips();

  return (
    <main>
      <h1>My Trips</h1>
      <TripList trips={trips} />
    </main>
  );
}
```

**`components/trip-list.tsx`** — Client Component that receives data as props (no fetching)

```tsx
'use client';

import type { Trip } from '@/db/schema';

interface TripListProps {
  trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
  return (
    <ul>
      {trips.map((trip) => (
        <li key={trip.id}>{trip.name}</li>
      ))}
    </ul>
  );
}
```

The page does all the fetching; the Client Component is purely presentational and receives data as props.

## Summary

| Where to fetch data | Allowed? |
|---|---|
| Server Component | yes |
| Client Component | no |
| Route Handler | no |
| Server Action (mutation only) | only for writes — not reads |

| How to query the DB | Allowed? |
|---|---|
| Drizzle ORM via `/data` helper | yes |
| Raw SQL | no |
| Direct DB call outside `/data` | no |
| Unscoped query (no userId filter) | never |
