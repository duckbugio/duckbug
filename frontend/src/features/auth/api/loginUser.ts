import {LoginCredentials, LoginResponse} from '@/features/auth/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {z} from 'zod';

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const Schema = z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        expiresIn: z.number(),
    });
    return requestWithSchema<LoginResponse>(`/login`, Schema, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
};
