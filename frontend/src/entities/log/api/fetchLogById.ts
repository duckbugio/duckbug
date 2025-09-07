import {Log} from '@/entities/log/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchLogParams {
    id: string;
}

export const fetchLogById = async ({id}: FetchLogParams): Promise<Log> => {
    const response = await apiClient(`/logs/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
