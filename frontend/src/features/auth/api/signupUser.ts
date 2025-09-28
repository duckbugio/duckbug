import {SignupCredentials, SignupResponse} from '@/features/auth/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {z} from 'zod';

export const signupUser = async (credentials: SignupCredentials): Promise<SignupResponse> => {
    const Schema = z.object({
        success: z.boolean(),
    });
    return requestWithSchema<SignupResponse>(`/signup`, Schema, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
};
