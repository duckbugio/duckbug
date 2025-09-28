import {LogGroup} from '@/entities/log/model/types';
import {LogGroupSchema} from '@/entities/log/model/schemas';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {createPageSchema} from '@/shared/lib/schemas/common';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface LogGroupsResponse {
    count: number;
    items: LogGroup[];
}

interface FetchLogGroupsParams {
    projectId?: string;
    page: number;
    pageSize: number;
    filters: {
        level: string;
        search: string;
        timeFrom: number | null;
        timeTo: number | null;
    };
}

export const fetchLogGroups = async ({
    projectId,
    page,
    pageSize,
    filters,
}: FetchLogGroupsParams): Promise<LogGroupsResponse> => {
    const params = buildSearchParams({
        sort: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize,
        projectId,
        level: filters.level,
        search: filters.search,
        timeFrom: filters.timeFrom,
        timeTo: filters.timeTo,
    });

    const PageSchema = createPageSchema(LogGroupSchema);
    return requestWithSchema<LogGroupsResponse>(`${ENDPOINTS.logs.groups}?${params}`, PageSchema);
};
