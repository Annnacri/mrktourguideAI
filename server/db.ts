import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertPreviewPreference,
  InsertUser,
  previewPreferences,
  tourPreviewTranslations,
  tourPreviews,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listTourPreviews() {
  const db = await getDb();
  if (!db) return [];

  const tours = await db.select().from(tourPreviews).orderBy(asc(tourPreviews.id));
  const translations = await db.select().from(tourPreviewTranslations).orderBy(asc(tourPreviewTranslations.id));

  return tours.map((tour) => ({
    ...tour,
    stops: JSON.parse(tour.stops) as string[],
    inclusions: JSON.parse(tour.inclusions) as string[],
    translations: translations
      .filter((translation) => translation.tourId === tour.id)
      .map(({ language, title, description }) => ({ language, title, description })),
  }));
}

export async function getPreviewPreference(sessionKey: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(previewPreferences).where(eq(previewPreferences.sessionKey, sessionKey)).limit(1);
  return result[0] ?? null;
}

export async function upsertPreviewPreference(preference: InsertPreviewPreference) {
  const db = await getDb();
  if (!db) return undefined;

  const values: InsertPreviewPreference = {
    sessionKey: preference.sessionKey,
    selectedTourSlug: preference.selectedTourSlug ?? "food",
    selectedLanguage: preference.selectedLanguage ?? "en",
  };

  await db.insert(previewPreferences).values(values).onDuplicateKeyUpdate({
    set: {
      selectedTourSlug: values.selectedTourSlug,
      selectedLanguage: values.selectedLanguage,
      updatedAt: new Date(),
    },
  });

  return getPreviewPreference(values.sessionKey);
}
