import {Err} from '@/entities/error/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ErrSchema} from '@/entities/error/model/schemas';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchErrorParams {
    id: string;
}

export const fetchErrorById = async ({id}: FetchErrorParams): Promise<Err> =>
    requestWithSchema(ENDPOINTS.errors.byId(id), ErrSchema);
