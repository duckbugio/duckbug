import {LogGroup} from '@/entities/log/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchLogGroupParams {
    id: string;
}

export const fetchLogGroupById = async ({id}: FetchLogGroupParams): Promise<LogGroup> => {
    const response = await apiClient(`/log-groups/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
