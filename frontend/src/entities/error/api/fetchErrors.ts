import {Err} from '@/entities/error/model/types';
import {apiClient} from '@/shared/api/apiClient';

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
    const params = new URLSearchParams({
        sort: 'desc',
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
        ...(projectId && {projectId}),
        ...(groupId && {groupId}),
        ...(filters.search && {search: filters.search}),
        ...(filters.timeFrom && {timeFrom: filters.timeFrom.toString()}),
        ...(filters.timeTo && {timeTo: filters.timeTo.toString()}),
    });

    const response = await apiClient(`/errors?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
