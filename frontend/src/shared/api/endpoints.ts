const ERRORS_ROOT = '/errors';
const ERROR_GROUPS_ROOT = '/error-groups';
const LOGS_ROOT = '/logs';
const LOG_GROUPS_ROOT = '/log-groups';
const PROJECTS_ROOT = '/projects';

export const ENDPOINTS = {
    auth: {
        login: '/login',
        signup: '/signup',
        refresh: '/refresh',
    },
    errors: {
        root: ERRORS_ROOT,
        byId: (id: string) => `${ERRORS_ROOT}/${id}`,
        stats: `${ERRORS_ROOT}/stats`,
        groups: ERROR_GROUPS_ROOT,
        groupById: (id: string) => `${ERROR_GROUPS_ROOT}/${id}`,
        groupsStatusBatch: `${ERROR_GROUPS_ROOT}/status:batch`,
    },
    logs: {
        root: LOGS_ROOT,
        byId: (id: string) => `${LOGS_ROOT}/${id}`,
        stats: `${LOGS_ROOT}/stats`,
        groups: LOG_GROUPS_ROOT,
        groupById: (id: string) => `${LOG_GROUPS_ROOT}/${id}`,
    },
    projects: {
        root: PROJECTS_ROOT,
        byId: (id: string) => `${PROJECTS_ROOT}/${id}`,
        dsn: (id: string) => `${PROJECTS_ROOT}/${id}/dsn`,
    },
} as const;
