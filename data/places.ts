import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { places } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type NewPlace = {
  country: string;
  city?: string;
  description?: string;
  visitedOn: string;
  favourite?: boolean;
};

export async function createPlace(input: NewPlace) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const [place] = await db
    .insert(places)
    .values({ ...input, userId })
    .returning();
  return place;
}

export async function deletePlace(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  await db
    .delete(places)
    .where(and(eq(places.id, id), eq(places.userId, userId)));
}

export async function getUserPlaces() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return db.select().from(places).where(eq(places.userId, userId));
}

export async function getPlaceById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const [place] = await db
    .select()
    .from(places)
    .where(and(eq(places.id, id), eq(places.userId, userId)));
  return place ?? null;
}

export type UpdatePlace = {
  country: string;
  city?: string;
  description?: string;
  visitedOn: string;
  favourite?: boolean;
};

export async function updatePlace(id: string, input: UpdatePlace) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const [place] = await db
    .update(places)
    .set(input)
    .where(and(eq(places.id, id), eq(places.userId, userId)))
    .returning();
  return place;
}
