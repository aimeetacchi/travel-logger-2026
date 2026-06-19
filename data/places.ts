import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { places } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserPlaces() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return db.select().from(places).where(eq(places.userId, userId));
}
