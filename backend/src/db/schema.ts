import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    passwordHash: text("password_hash").notNull()
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
export type RefreshToken = typeof refreshTokens.$inferInsert;