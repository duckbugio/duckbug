import {ErrGroup} from '@/entities/error/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchErrorGroupParams {
    id: string;
}

export const fetchErrorGroupById = async ({id}: FetchErrorGroupParams): Promise<ErrGroup> => {
    const response = await apiClient(`/error-groups/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
