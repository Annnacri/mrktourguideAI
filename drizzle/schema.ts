import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Public tour concepts shown in the interactive homepage preview. */
export const tourPreviews = mysqlTable("tourPreviews", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }).notNull(),
  destination: varchar("destination", { length: 160 }).notNull(),
  duration: varchar("duration", { length: 64 }).notNull(),
  groupFormat: varchar("groupFormat", { length: 128 }).notNull(),
  languages: varchar("languages", { length: 128 }).notNull(),
  color: varchar("color", { length: 16 }).notNull(),
  stops: text("stops").notNull(),
  inclusions: text("inclusions").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TourPreview = typeof tourPreviews.$inferSelect;
export type InsertTourPreview = typeof tourPreviews.$inferInsert;

/** Localized strings for each public preview. */
export const tourPreviewTranslations = mysqlTable(
  "tourPreviewTranslations",
  {
    id: int("id").autoincrement().primaryKey(),
    tourId: int("tourId").notNull(),
    language: varchar("language", { length: 8 }).notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    tourLanguageUnique: uniqueIndex("tour_preview_language_unique").on(table.tourId, table.language),
  }),
);

export type TourPreviewTranslation = typeof tourPreviewTranslations.$inferSelect;
export type InsertTourPreviewTranslation = typeof tourPreviewTranslations.$inferInsert;

/** Anonymous visitor state so a preview selection can persist without login. */
export const previewPreferences = mysqlTable("previewPreferences", {
  id: int("id").autoincrement().primaryKey(),
  sessionKey: varchar("sessionKey", { length: 128 }).notNull().unique(),
  selectedTourSlug: varchar("selectedTourSlug", { length: 64 }).notNull().default("food"),
  selectedLanguage: varchar("selectedLanguage", { length: 8 }).notNull().default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PreviewPreference = typeof previewPreferences.$inferSelect;
export type InsertPreviewPreference = typeof previewPreferences.$inferInsert;
