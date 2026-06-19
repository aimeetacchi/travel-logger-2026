"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createPlace } from "@/data/places";

const CreatePlaceSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  description: z.string().optional(),
  visitedOn: z.string().date("Invalid date"),
  favourite: z.boolean().optional(),
});

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;

export async function createPlaceAction(input: CreatePlaceInput) {
  const validated = CreatePlaceSchema.parse(input);
  await createPlace(validated);
  redirect("/dashboard");
}
