import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {DSNSchema} from '@/shared/lib/schemas/common';

interface ProjectsDsnResponse {
    dsn: string;
}

interface FetchProjectParams {
    id: string;
}

export const fetchProjectDsn = async ({id}: FetchProjectParams): Promise<ProjectsDsnResponse> =>
    requestWithSchema<ProjectsDsnResponse>(`/projects/${id}/dsn`, DSNSchema);
