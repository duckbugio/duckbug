export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
};

export const LOCAL_STORAGE_KEYS = {
    THEME: 'theme',
    LANGUAGE: 'i18nextLng',
};

export const LANGUAGES = {
    RU: 'ru',
    EN: 'en',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
