export const ENDPOINTS = {
    auth: {
        login: '/login',
        signup: '/signup',
        refresh: '/refresh',
    },
    errors: {
        root: '/errors',
        stats: '/errors/stats',
        groups: '/error-groups',
        groupsStatusBatch: '/error-groups/status:batch',
    },
    logs: {
        root: '/logs',
        stats: '/logs/stats',
        groups: '/log-groups',
    },
    projects: {
        root: '/projects',
    },
} as const;
