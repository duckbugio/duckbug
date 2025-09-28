import {Project} from '@/entities/project/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ProjectSchema} from '@/entities/project/model/schemas';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchProjectParams {
    id: string;
}

export const fetchProjectById = async ({id}: FetchProjectParams): Promise<Project> =>
    requestWithSchema(ENDPOINTS.projects.byId(id), ProjectSchema);
