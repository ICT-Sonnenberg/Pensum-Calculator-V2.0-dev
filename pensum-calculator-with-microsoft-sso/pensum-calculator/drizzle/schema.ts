import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, index, unique } from "drizzle-orm/mysql-core";

/**
 * Users table with support for multiple authentication providers
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  microsoftId: varchar("microsoftId", { length: 255 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }), // 'manus', 'microsoft'
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Departments/Offers table
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: int("isActive", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Teams table
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  departmentId: int("departmentId").notNull(),
  description: text("description"),
  isActive: int("isActive", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  departmentIdx: index("idx_department").on(table.departmentId),
}));

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Clients table
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  careLevel: int("careLevel").notNull(), // 1-5
  teamId: int("teamId").notNull(),
  departmentId: int("departmentId").notNull(),
  notes: text("notes"),
  isActive: int("isActive", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  teamIdx: index("idx_team").on(table.teamId),
  careLevelIdx: index("idx_care_level").on(table.careLevel),
  departmentIdx: index("idx_department").on(table.departmentId),
  uniqueNamePerTeam: unique("unq_name_team").on(table.firstName, table.lastName, table.teamId),
}));

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Care level configuration
 */
export const careLevelConfig = mysqlTable("care_level_config", {
  id: int("id").autoincrement().primaryKey(),
  level: int("level").notNull().unique(), // 1-5
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  hoursPerWeek: decimal("hoursPerWeek", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CareLevelConfig = typeof careLevelConfig.$inferSelect;
export type InsertCareLevelConfig = typeof careLevelConfig.$inferInsert;
