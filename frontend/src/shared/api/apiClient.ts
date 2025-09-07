import {API_BASE_URL} from '@/shared/config/api';
import {$logout} from '@/features/auth/model/authModel';

export const apiClient = async (input: RequestInfo, init?: RequestInit) => {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new Headers(init?.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(API_BASE_URL + input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({refreshToken}),
                });

                if (refreshResponse.ok) {
                    const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
                        await refreshResponse.json();

                    localStorage.setItem('accessToken', newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    return fetch(input, {
                        ...init,
                        headers,
                    });
                }
            } catch (e) {
                // console.error('Refresh token failed', e);
            }
        }
        $logout();
    }

    return response;
};
