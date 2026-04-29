import { pgTable, varchar, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  passwordHash: text("password_hash").notNull()
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  fountainText: text("fountain_text"),
  outlineText: text("outline_text"),
  titlePageData: jsonb("title_page_data").$type<{
    title?: string;
    author?: string;
    basedOn?: string;
    contact?: string;
    draft?: string;
  }>(),
  pageSize: varchar("page_size", { length: 20 }).default("us-letter"),
  fontPreference: jsonb("font_preference").$type<{
    family: string;
    size: number;
    lineSpacing: number;
  }>().default({
      family: "Courier Prime",
      size: 12,
      lineSpacing: 1
  })
});

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").notNull().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at")
});

export type NewUser = typeof users.$inferInsert;
export type NewProject = typeof projects.$inferInsert;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

