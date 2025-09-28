import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {DSNSchema} from '@/shared/lib/schemas/common';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface ProjectsDsnResponse {
    dsn: string;
}

interface FetchProjectParams {
    id: string;
}

export const fetchProjectDsn = async ({id}: FetchProjectParams): Promise<ProjectsDsnResponse> =>
    requestWithSchema<ProjectsDsnResponse>(ENDPOINTS.projects.dsn(id), DSNSchema);
