import {requestJson} from '@/shared/api/requestJson';
import type {ZodSchema} from 'zod';

export const requestWithSchema = async <T>(
    path: string,
    schema: ZodSchema<T>,
    init?: RequestInit,
): Promise<T> => {
    const raw = await requestJson<unknown>(path, init);
    return schema.parse(raw);
};
