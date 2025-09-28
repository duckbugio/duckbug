import {Project} from '@/entities/project/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ProjectSchema} from '@/entities/project/model/schemas';

interface FetchProjectParams {
    id: string;
}

export const fetchProjectById = async ({id}: FetchProjectParams): Promise<Project> =>
    requestWithSchema(`/projects/${id}`, ProjectSchema);
