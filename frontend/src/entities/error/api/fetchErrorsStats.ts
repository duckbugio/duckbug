import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {StatsSchema} from '@/shared/lib/schemas/common';
import {ENDPOINTS} from '@/shared/api/endpoints';

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

    return requestWithSchema<ErrorsStatsResponse>(
        `${ENDPOINTS.errors.stats}?${params}`,
        StatsSchema,
    );
};
