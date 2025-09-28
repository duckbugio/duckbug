import {requestVoid} from '@/shared/api/requestVoid';

interface UpdateErrorGroupsStatusParams {
    ids: string[];
    status: 'resolved' | 'unresolved';
}

export const updateErrorGroupsStatus = async (
    params: UpdateErrorGroupsStatusParams,
): Promise<void> => {
    await requestVoid(`/error-groups/status:batch`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
    });
};
