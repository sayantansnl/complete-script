import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    passwordHash: text("password_hash").notNull()
});
