import {apiClient} from '@/shared/api/apiClient';

interface ProjectsDsnResponse {
    dsn: string;
}

interface FetchProjectParams {
    id: string;
}

export const fetchProjectDsn = async ({id}: FetchProjectParams): Promise<ProjectsDsnResponse> => {
    const response = await apiClient(`/projects/${id}/dsn`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
