import {z} from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    openErrors: z.number().optional(),
    logsLast24h: z.number().optional(),
});
