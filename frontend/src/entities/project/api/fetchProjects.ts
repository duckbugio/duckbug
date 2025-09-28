import {Project} from '@/entities/project/model/types';
import {ProjectSchema} from '@/entities/project/model/schemas';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {buildSearchParams} from '@/shared/lib/http/buildSearchParams';
import {createPageSchema} from '@/shared/lib/schemas/common';
import {ENDPOINTS} from '@/shared/api/endpoints';

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
    const params = buildSearchParams({
        sort: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });

    const PageSchema = createPageSchema(ProjectSchema);
    return requestWithSchema<ProjectsResponse>(`${ENDPOINTS.projects.root}?${params}`, PageSchema);
};
