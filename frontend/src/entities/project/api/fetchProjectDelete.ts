import {apiClient} from '@/shared/api/apiClient';

interface DeleteProjectParams {
    id: string;
}

export const fetchProjectDelete = async ({id}: DeleteProjectParams): Promise<void> => {
    const response = await apiClient(`/projects/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};
