import {z} from 'zod';

export const createPageSchema = <T>(item: z.ZodType<T>) =>
    z.object({
        count: z.number(),
        items: z.array(item),
    });

export const StatsSchema = z.object({
    last24h: z.number(),
    last7d: z.number(),
    last30d: z.number(),
});

export const DSNSchema = z.object({
    dsn: z.string(),
});
