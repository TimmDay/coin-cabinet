import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

// Test table for fruits functionality
export const test = pgTable("Test", (d) => ({
  id: d.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  fruitName: d.text().notNull(),
  created_at: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

// Type inference for TypeScript
export type Test = typeof test.$inferSelect;
export type NewTest = typeof test.$inferInsert;
