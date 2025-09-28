import {Project} from '@/entities/project/model/types';
import {requestJson} from '@/shared/api/requestJson';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchProjectCreate {
    name: string;
}

export const fetchProjectCreate = async ({name}: FetchProjectCreate): Promise<Project> => {
    return requestJson<Project>(ENDPOINTS.projects.root, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
        }),
    });
};
