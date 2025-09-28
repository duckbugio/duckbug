import {ErrGroup} from '@/entities/error/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ErrGroupSchema} from '@/entities/error/model/schemas';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchErrorGroupParams {
    id: string;
}

export const fetchErrorGroupById = async ({id}: FetchErrorGroupParams): Promise<ErrGroup> =>
    requestWithSchema(ENDPOINTS.errors.groupById(id), ErrGroupSchema);
