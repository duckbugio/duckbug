import {Project} from '@/entities/project/model/types';
import {requestJson} from '@/shared/api/requestJson';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchProjectUpdate {
    name: string;
    technologyId: number;
}

export const fetchProjectUpdate = async (
    id: string,
    {name, technologyId}: FetchProjectUpdate,
): Promise<Project> => {
    return requestJson<Project>(ENDPOINTS.projects.byId(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            technologyId,
        }),
    });
};
