export const getProjectPath = (id: string) => `/projects/${id}`;
export const getLogPath = (id: string) => `/logs/${id}`;
export const getErrorPath = (id: string) => `/errors/${id}`;
export const getErrorGroupPath = (projectId: string, id: string) =>
    `/projects/${projectId}/error-groups/${id}`;

export const getLogGroupPath = (projectId: string, id: string) =>
    `/projects/${projectId}/log-groups/${id}`;
