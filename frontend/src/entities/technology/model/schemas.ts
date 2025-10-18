import {z} from 'zod';

export const TechnologySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    exampleDsnConnection: z.string(),
});
