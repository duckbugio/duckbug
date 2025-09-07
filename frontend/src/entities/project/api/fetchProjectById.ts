import {Project} from '@/entities/project/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchProjectParams {
    id: string;
}

export const fetchProjectById = async ({id}: FetchProjectParams): Promise<Project> => {
    const response = await apiClient(`/projects/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
