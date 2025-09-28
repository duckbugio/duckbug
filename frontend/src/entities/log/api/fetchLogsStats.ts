import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {StatsSchema} from '@/shared/lib/schemas/common';

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
    const params = buildSearchParams({
        projectId,
        groupId,
    });

    return requestWithSchema<LogsStatsResponse>(`/logs/stats?${params}`, StatsSchema);
};
