import {Log} from '@/entities/log/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {LogSchema} from '@/entities/log/model/schemas';

interface FetchLogParams {
    id: string;
}

export const fetchLogById = async ({id}: FetchLogParams): Promise<Log> =>
    requestWithSchema(`/logs/${id}`, LogSchema);
