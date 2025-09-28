import {requestVoid} from '@/shared/api/requestVoid';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface DeleteProjectParams {
    id: string;
}

export const fetchProjectDelete = async ({id}: DeleteProjectParams): Promise<void> => {
    await requestVoid(ENDPOINTS.projects.byId(id), {
        method: 'DELETE',
    });
};
