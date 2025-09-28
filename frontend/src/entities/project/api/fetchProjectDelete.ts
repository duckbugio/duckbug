import {requestVoid} from '@/shared/api/requestVoid';

interface DeleteProjectParams {
    id: string;
}

export const fetchProjectDelete = async ({id}: DeleteProjectParams): Promise<void> => {
    await requestVoid(`/projects/${id}`, {
        method: 'DELETE',
    });
};
