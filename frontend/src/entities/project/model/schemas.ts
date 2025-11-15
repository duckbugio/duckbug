import {z} from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    technologyId: z.number(),
    openErrors: z.number().optional(),
    logsLast24h: z.number().optional(),
});
