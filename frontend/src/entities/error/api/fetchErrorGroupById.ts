import {ErrGroup} from '@/entities/error/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ErrGroupSchema} from '@/entities/error/model/schemas';

interface FetchErrorGroupParams {
    id: string;
}

export const fetchErrorGroupById = async ({id}: FetchErrorGroupParams): Promise<ErrGroup> =>
    requestWithSchema(`/error-groups/${id}`, ErrGroupSchema);
