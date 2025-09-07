import {API_BASE_URL} from '@/shared/config/api';
import {SignupCredentials, SignupResponse} from '@/features/auth/types';

export const signupUser = async (credentials: SignupCredentials): Promise<SignupResponse> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Signup failed: ${response.status} - ${errorText}`);
    }

    return response.json();
};
