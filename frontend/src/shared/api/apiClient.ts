import {API_BASE_URL} from '@/shared/config/api';

let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: (() => void) | null) => {
    logoutHandler = handler;
};

let accessTokenProvider: (() => string | null) | null = null;
let refreshTokenProvider: (() => string | null) | null = null;
let tokensRefreshedHandler:
    | ((tokens: {accessToken: string; refreshToken?: string | null}) => void)
    | null = null;

export const setAccessTokenProvider = (provider: (() => string | null) | null) => {
    accessTokenProvider = provider;
};

export const setRefreshTokenProvider = (provider: (() => string | null) | null) => {
    refreshTokenProvider = provider;
};

export const setTokensRefreshedHandler = (
    handler: ((tokens: {accessToken: string; refreshToken?: string | null}) => void) | null,
) => {
    tokensRefreshedHandler = handler;
};

const tryRefreshTokens = async (
    currentRefreshToken: string,
): Promise<{accessToken: string; refreshToken: string | null} | null> => {
    try {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refreshToken: currentRefreshToken}),
        });

        if (!refreshResponse.ok) {
            return null;
        }

        const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
            await refreshResponse.json();
        if (tokensRefreshedHandler) {
            tokensRefreshedHandler({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        } else {
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
        }
        return {accessToken: newAccessToken, refreshToken: newRefreshToken ?? null};
    } catch {
        return null;
    }
};

export const apiClient = async (input: string, init?: RequestInit) => {
    if (input.startsWith('http://') || input.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed in apiClient. Use relative paths only.');
    }
    const accessToken = accessTokenProvider
        ? accessTokenProvider()
        : localStorage.getItem('accessToken');

    const headers = new Headers(init?.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(API_BASE_URL + input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        const refreshToken = refreshTokenProvider
            ? refreshTokenProvider()
            : localStorage.getItem('refreshToken');
        if (!refreshToken) {
            if (logoutHandler) logoutHandler();
            return response;
        }

        const refreshed = await tryRefreshTokens(refreshToken);
        if (!refreshed) {
            try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } catch {}
            if (logoutHandler) logoutHandler();
            return response;
        }

        headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
        return fetch(API_BASE_URL + input, {
            ...init,
            headers,
        });
    }

    return response;
};
