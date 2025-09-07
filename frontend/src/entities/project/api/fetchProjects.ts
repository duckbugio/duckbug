import {Project} from '@/entities/project/model/types';
import {apiClient} from '@/shared/api/apiClient';

interface ProjectsResponse {
    count: number;
    items: Project[];
}

interface FetchProjectsParams {
    page: number;
    pageSize: number;
}

export const fetchProjects = async ({
    page,
    pageSize,
}: FetchProjectsParams): Promise<ProjectsResponse> => {
    const params = new URLSearchParams({
        sort: 'desc',
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
    });

    const response = await apiClient(`/projects?${params}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
