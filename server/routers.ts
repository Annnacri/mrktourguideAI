import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getPreviewPreference, listTourPreviews, upsertPreviewPreference } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  previewData: router({
    list: publicProcedure.query(() => listTourPreviews()),
    preference: publicProcedure
      .input(z.object({ sessionKey: z.string().min(16).max(128) }))
      .query(({ input }) => getPreviewPreference(input.sessionKey)),
    savePreference: publicProcedure
      .input(
        z.object({
          sessionKey: z.string().min(16).max(128),
          selectedTourSlug: z.string().min(1).max(64),
          selectedLanguage: z.enum(["en", "pt", "es", "fr", "de", "it", "ar"]),
        }),
      )
      .mutation(({ input }) => upsertPreviewPreference(input)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
