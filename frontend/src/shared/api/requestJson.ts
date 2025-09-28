import {apiClient} from '@/shared/api/apiClient';
import {mapHttpError} from '@/shared/lib/api/mapHttpError';

export const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await apiClient(path, init);

    if (!response.ok) {
        throw mapHttpError(response);
    }

    return response.json() as Promise<T>;
};
