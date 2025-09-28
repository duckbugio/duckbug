import {ErrGroup, ErrorGroupStatus} from '@/entities/error/model/types';
import {ErrGroupSchema} from '@/entities/error/model/schemas';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {createPageSchema} from '@/shared/lib/schemas/common';

interface ErrorGroupsResponse {
    count: number;
    items: ErrGroup[];
}

interface FetchErrorGroupsParams {
    projectId?: string;
    page: number;
    pageSize: number;
    filters: {
        search: string;
        timeFrom: number | null;
        timeTo: number | null;
        status?: ErrorGroupStatus | null;
    };
}

export const fetchErrorGroups = async ({
    projectId,
    page,
    pageSize,
    filters,
}: FetchErrorGroupsParams): Promise<ErrorGroupsResponse> => {
    const params = buildSearchParams({
        sort: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize,
        projectId,
        search: filters.search,
        timeFrom: filters.timeFrom,
        timeTo: filters.timeTo,
        status: filters.status ?? undefined,
    });

    const PageSchema = createPageSchema(ErrGroupSchema);
    return requestWithSchema<ErrorGroupsResponse>(`/error-groups?${params}`, PageSchema);
};
