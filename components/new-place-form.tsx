"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
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
import { createPlaceAction, type CreatePlaceInput } from "@/app/dashboard/place/new/actions";

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  description: z.string().optional(),
  visitedOn: z.string().date("Invalid date"),
  favourite: z.boolean().optional(),
});

export function NewPlaceForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePlaceInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      city: "",
      description: "",
      visitedOn: "",
      favourite: false,
    },
  });

  function onSubmit(data: CreatePlaceInput) {
    startTransition(async () => {
      await createPlaceAction(data);
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Log place"}
        </Button>
      </form>
    </Form>
  );
}
