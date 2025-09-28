import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {StatsSchema} from '@/shared/lib/schemas/common';
import {ENDPOINTS} from '@/shared/api/endpoints';

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

    return requestWithSchema<LogsStatsResponse>(`${ENDPOINTS.logs.stats}?${params}`, StatsSchema);
};
