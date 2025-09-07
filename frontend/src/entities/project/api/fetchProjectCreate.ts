import {Project} from '@/entities/project/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface FetchProjectCreate {
    name: string;
}

export const fetchProjectCreate = async ({name}: FetchProjectCreate): Promise<Project> => {
    const response = await apiClient(`/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
