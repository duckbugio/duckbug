import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {StatsSchema} from '@/shared/lib/schemas/common';

export interface ErrorsStatsResponse {
    last24h: number;
    last7d: number;
    last30d: number;
}

interface FetchErrorsStatsParams {
    projectId: string;
    groupId?: string;
}

export const fetchErrorsStats = async ({
    projectId,
    groupId,
}: FetchErrorsStatsParams): Promise<ErrorsStatsResponse> => {
    const params = buildSearchParams({
        projectId,
        groupId,
    });

    return requestWithSchema<ErrorsStatsResponse>(`/errors/stats?${params}`, StatsSchema);
};
