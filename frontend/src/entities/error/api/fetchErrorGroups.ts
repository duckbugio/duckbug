import {ErrGroup} from '@/entities/error/model/types';
import {apiClient} from '@/shared/api/apiClient';

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
    };
}

export const fetchErrorGroups = async ({
    projectId,
    page,
    pageSize,
    filters,
}: FetchErrorGroupsParams): Promise<ErrorGroupsResponse> => {
    const params = new URLSearchParams({
        sort: 'desc',
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
        ...(projectId && {projectId}),
        ...(filters.search && {search: filters.search}),
        ...(filters.timeFrom && {timeFrom: filters.timeFrom.toString()}),
        ...(filters.timeTo && {timeTo: filters.timeTo.toString()}),
    });

    const response = await apiClient(`/error-groups?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
