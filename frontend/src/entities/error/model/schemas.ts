import {z} from 'zod';

export const ErrSchema = z.object({
    id: z.string(),
    message: z.string(),
    file: z.string(),
    line: z.number().int(),
    stacktrace: z.array(z.unknown()).optional(),
    context: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional(),
    ip: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    method: z.string().nullable().optional(),
    headers: z.record(z.unknown()).nullable().optional(),
    queryParams: z.record(z.unknown()).nullable().optional(),
    bodyParams: z.record(z.unknown()).nullable().optional(),
    cookies: z.record(z.unknown()).nullable().optional(),
    session: z.record(z.unknown()).nullable().optional(),
    files: z.record(z.unknown()).nullable().optional(),
    env: z.record(z.unknown()).nullable().optional(),
    time: z.number(),
});

export const ErrGroupSchema = z.object({
    id: z.string(),
    message: z.string(),
    file: z.string(),
    line: z.number().int(),
    firstSeenAt: z.number(),
    lastSeenAt: z.number(),
    counter: z.number(),
    status: z.enum(['unresolved', 'resolved', 'ignored']),
});
