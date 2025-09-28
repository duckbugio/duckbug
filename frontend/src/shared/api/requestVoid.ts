import {apiClient} from '@/shared/api/apiClient';
import {mapHttpError} from '@/shared/lib/api/mapHttpError';

export const requestVoid = async (path: string, init?: RequestInit): Promise<void> => {
    const response = await apiClient(path, init);
    if (!response.ok) {
        throw mapHttpError(response);
    }
};
