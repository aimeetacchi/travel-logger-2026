import {
  pgTable,
  serial,
  text,
  date,
  boolean,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const places = pgTable("places", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  visitedOn: date("visited_on").notNull(),
  favourite: boolean("favourite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
