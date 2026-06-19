"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updatePlaceAction, type UpdatePlaceInput } from "@/app/dashboard/places/[placeId]/actions";

const schema = z.object({
  id: z.string().uuid(),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  description: z.string().optional(),
  visitedOn: z.string().date("Invalid date"),
  favourite: z.boolean().optional(),
});

interface EditPlaceFormProps {
  place: {
    id: string;
    country: string;
    city: string | null;
    description: string | null;
    visitedOn: string;
    favourite: boolean;
  };
}

export function EditPlaceForm({ place }: EditPlaceFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<UpdatePlaceInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: place.id,
      country: place.country,
      city: place.city ?? "",
      description: place.description ?? "",
      visitedOn: place.visitedOn,
      favourite: place.favourite,
    },
  });

  function onSubmit(data: UpdatePlaceInput) {
    startTransition(async () => {
      await updatePlaceAction(data);
      router.push("/dashboard");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitedOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date visited</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="What made this place special?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favourite"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Mark as favourite</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
