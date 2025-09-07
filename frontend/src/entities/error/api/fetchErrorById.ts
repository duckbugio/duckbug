import {Err} from '@/entities/error/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchErrorParams {
    id: string;
}

export const fetchErrorById = async ({id}: FetchErrorParams): Promise<Err> => {
    const response = await apiClient(`/errors/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
