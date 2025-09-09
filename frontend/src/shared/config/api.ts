const PLACEHOLDER = '__REACT_APP_API_BASE_URL__';
const RUNTIME_API_BASE_URL = PLACEHOLDER.startsWith('__') ? undefined : PLACEHOLDER;

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || RUNTIME_API_BASE_URL || 'https://duckbug.io/api/v1';
