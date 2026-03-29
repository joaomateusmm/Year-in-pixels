import { pgTable, varchar, jsonb } from "drizzle-orm/pg-core";

export const dayRecords = pgTable("day_records", {
  dateKey: varchar("date_key", { length: 10 }).primaryKey(),
  activityIds: jsonb("activity_ids").$type<string[]>().default([]).notNull(),
});

export const activitiesTable = pgTable("activities", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
});
