import {apiClient} from '@/shared/api/apiClient';

export interface LogsStatsResponse {
    last24h: number;
    last7d: number;
    last30d: number;
}

interface FetchLogsStatsParams {
    projectId: string;
    groupId?: string;
}

export const fetchLogsStats = async ({
    projectId,
    groupId,
}: FetchLogsStatsParams): Promise<LogsStatsResponse> => {
    const params = new URLSearchParams({
        ...(projectId && {projectId}),
        ...(groupId && {groupId: groupId}),
    });

    const response = await apiClient(`/logs/stats?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
