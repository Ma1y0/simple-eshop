import { sql } from "drizzle-orm";
import {
  sqliteTable,
  int,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

const dates = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
} as const;

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  avatarURL: text("avatar_url"),
  vip: integer({ mode: "boolean" }).notNull().default(false),

  ...dates,
});

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),

  ...dates,
});

export const inventory = sqliteTable(
  "inventory",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    price: integer(),
    img_url: text(),
    description: text(),

    ...dates,
  },
  (table) => [index("name_idx").on(table.name)],
);
