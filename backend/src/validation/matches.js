import { z } from 'zod';

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z.object({
  sport: z.string().nonempty(),
  homeTeam: z.string().nonempty(),
  awayTeam: z.string().nonempty(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string',
  }),
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((ctx, next) => {
  if (ctx.startTime && ctx.endTime) {
    const start = new Date(ctx.startTime);
    const end = new Date(ctx.endTime);
    if (end <= start) {
      next.addError({
        path: ['endTime'],
        message: 'endTime must be after startTime',
      });
    }
  }
});

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});