import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getPreviewPreference: vi.fn(async (sessionKey: string) => sessionKey === "missing-session-123" ? null : ({
    id: 1,
    sessionKey,
    selectedTourSlug: "food",
    selectedLanguage: "pt",
  })),
  listTourPreviews: vi.fn(async () => [
    {
      id: 1,
      slug: "food",
      label: "Food tour",
      destination: "Lisbon · Portugal",
      duration: "3h 30m",
      groupFormat: "Up to 8 guests",
      languages: "EN · PT · FR",
      color: "#f7c95b",
      stops: ["Market"],
      inclusions: ["Tastings"],
      translations: [{ language: "en", title: "Lisbon, one bite at a time", description: "A market route." }],
    },
  ]),
  upsertPreviewPreference: vi.fn(async (input) => ({ id: 2, ...input })),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("previewData", () => {
  it("returns persisted tour previews", async () => {
    const caller = appRouter.createCaller(createContext());
    const previews = await caller.previewData.list();

    expect(previews).toHaveLength(1);
    expect(previews[0]).toMatchObject({ slug: "food", destination: "Lisbon · Portugal" });
    expect(previews[0]?.translations[0]?.language).toBe("en");
  });

  it("reads a visitor preference by session key", async () => {
    const caller = appRouter.createCaller(createContext());
    const preference = await caller.previewData.preference({ sessionKey: "preview-session-123" });

    expect(preference).toMatchObject({ sessionKey: "preview-session-123", selectedLanguage: "pt" });
  });

  it("returns null for a visitor with no saved preference", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.previewData.preference({ sessionKey: "missing-session-123" })).resolves.toBeNull();
  });

  it("persists a supported language and selected tour", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.previewData.savePreference({
      sessionKey: "preview-session-123",
      selectedTourSlug: "adventure",
      selectedLanguage: "ar",
    });

    expect(result).toMatchObject({ selectedTourSlug: "adventure", selectedLanguage: "ar" });
  });

  it("rejects unsupported preview languages", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.previewData.savePreference({
        sessionKey: "preview-session-123",
        selectedTourSlug: "food",
        selectedLanguage: "xx" as "en",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
