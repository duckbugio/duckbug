const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = (): string | null => {
    try {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const getRefreshToken = (): string | null => {
    try {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const setAccessToken = (token: string): void => {
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {}
};

export const setRefreshToken = (token: string): void => {
    try {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch {}
};

export const clearTokens = (): void => {
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {}
};
