import {Err} from '@/entities/error/model/types';
import {ErrSchema} from '@/entities/error/model/schemas';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ENDPOINTS} from '@/shared/api/endpoints';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {createPageSchema} from '@/shared/lib/schemas/common';

interface ErrorsResponse {
    count: number;
    items: Err[];
}

interface FetchErrorsParams {
    projectId?: string;
    groupId?: string;
    page: number;
    pageSize: number;
    filters: {
        search: string;
        timeFrom: number | null;
        timeTo: number | null;
    };
}

export const fetchErrors = async ({
    projectId,
    groupId,
    page,
    pageSize,
    filters,
}: FetchErrorsParams): Promise<ErrorsResponse> => {
    const params = buildSearchParams({
        sort: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize,
        projectId,
        groupId,
        search: filters.search,
        timeFrom: filters.timeFrom,
        timeTo: filters.timeTo,
    });

    const PageSchema = createPageSchema(ErrSchema);
    return requestWithSchema<ErrorsResponse>(`${ENDPOINTS.errors.root}?${params}`, PageSchema);
};
