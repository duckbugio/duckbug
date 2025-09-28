import {Log} from '@/entities/log/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {LogSchema} from '@/entities/log/model/schemas';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchLogParams {
    id: string;
}

export const fetchLogById = async ({id}: FetchLogParams): Promise<Log> =>
    requestWithSchema(ENDPOINTS.logs.byId(id), LogSchema);
