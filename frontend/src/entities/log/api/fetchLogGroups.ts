import {LogGroup} from '@/entities/log/model/types';
import {apiClient} from '@/shared/api/apiClient';

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
    const params = new URLSearchParams({
        sort: 'desc',
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
        ...(projectId && {projectId}),
        ...(filters.level && {level: filters.level}),
        ...(filters.search && {search: filters.search}),
        ...(filters.timeFrom && {timeFrom: filters.timeFrom.toString()}),
        ...(filters.timeTo && {timeTo: filters.timeTo.toString()}),
    });

    const response = await apiClient(`/log-groups?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
