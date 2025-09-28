import {Err} from '@/entities/error/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {ErrSchema} from '@/entities/error/model/schemas';

interface FetchErrorParams {
    id: string;
}

export const fetchErrorById = async ({id}: FetchErrorParams): Promise<Err> =>
    requestWithSchema(`/errors/${id}`, ErrSchema);
