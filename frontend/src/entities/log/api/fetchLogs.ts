import {Log} from '@/entities/log/model/types';
import {apiClient} from '@/shared/api/apiClient';

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
    const params = new URLSearchParams({
        sort: 'desc',
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
        ...(projectId && {projectId}),
        ...(groupId && {groupId}),
        ...(filters.level && {level: filters.level}),
        ...(filters.search && {search: filters.search}),
        ...(filters.timeFrom && {timeFrom: filters.timeFrom.toString()}),
        ...(filters.timeTo && {timeTo: filters.timeTo.toString()}),
    });

    const response = await apiClient(`/logs?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
