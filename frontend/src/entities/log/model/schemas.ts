import {z} from 'zod';

export const LogSchema = z.object({
    id: z.string(),
    level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']),
    message: z.string(),
    context: z
        .union([z.record(z.unknown()), z.array(z.unknown()), z.string()])
        .nullable()
        .optional(),
    time: z.number(),
});

export const LogGroupSchema = z.object({
    id: z.string(),
    level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']),
    message: z.string(),
    firstSeenAt: z.number(),
    lastSeenAt: z.number(),
    counter: z.number(),
});
