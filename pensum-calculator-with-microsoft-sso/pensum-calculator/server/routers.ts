import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './_core/trpc.js';
import { COOKIE_NAME } from '../shared/const.js';
import { getStatistics, getAllDepartments, getAllTeams, getAllClients } from './db.js';

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME);
      if (ctx.req.session) {
        ctx.req.session.destroy(() => {});
      }
      return { success: true };
    }),
  }),

  statistics: router({
    get: protectedProcedure
      .input(z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return getStatistics(input?.dateFrom, input?.dateTo);
      }),
  }),

  departments: router({
    list: protectedProcedure.query(async () => {
      return getAllDepartments();
    }),
  }),

  teams: router({
    list: protectedProcedure.query(async () => {
      return getAllTeams();
    }),
  }),

  clients: router({
    list: protectedProcedure.query(async () => {
      return getAllClients();
    }),
  }),
});

export type AppRouter = typeof appRouter;
