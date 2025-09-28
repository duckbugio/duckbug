import {Log} from '@/entities/log/model/types';
import {LogSchema} from '@/entities/log/model/schemas';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ENDPOINTS} from '@/shared/api/endpoints';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {createPageSchema} from '@/shared/lib/schemas/common';

interface LogsResponse {
    count: number;
    items: Log[];
}

interface FetchLogsParams {
    projectId?: string;
    groupId?: string;
    page: number;
    pageSize: number;
    filters: {
        level: string;
        search: string;
        timeFrom: number | null;
        timeTo: number | null;
    };
}

export const fetchLogs = async ({
    projectId,
    groupId,
    page,
    pageSize,
    filters,
}: FetchLogsParams): Promise<LogsResponse> => {
    const params = buildSearchParams({
        sort: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize,
        projectId,
        groupId,
        level: filters.level,
        search: filters.search,
        timeFrom: filters.timeFrom,
        timeTo: filters.timeTo,
    });

    const PageSchema = createPageSchema(LogSchema);
    return requestWithSchema<LogsResponse>(`${ENDPOINTS.logs.root}?${params}`, PageSchema);
};
