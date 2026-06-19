"use server";

import { z } from "zod";
import { updatePlace } from "@/data/places";

const UpdatePlaceSchema = z.object({
  id: z.string().uuid(),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  description: z.string().optional(),
  visitedOn: z.string().date("Invalid date"),
  favourite: z.boolean().optional(),
});

export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;

export async function updatePlaceAction(input: UpdatePlaceInput) {
  const { id, ...fields } = UpdatePlaceSchema.parse(input);
  return updatePlace(id, fields);
}
