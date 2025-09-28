import {requestVoid} from '@/shared/api/requestVoid';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface UpdateErrorGroupsStatusParams {
    ids: string[];
    status: 'resolved' | 'unresolved';
}

export const updateErrorGroupsStatus = async (
    params: UpdateErrorGroupsStatusParams,
): Promise<void> => {
    await requestVoid(ENDPOINTS.errors.groupsStatusBatch, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
    });
};
