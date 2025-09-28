import {LogGroup} from '@/entities/log/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {LogGroupSchema} from '@/entities/log/model/schemas';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchLogGroupParams {
    id: string;
}

export const fetchLogGroupById = async ({id}: FetchLogGroupParams): Promise<LogGroup> =>
    requestWithSchema(ENDPOINTS.logs.groupById(id), LogGroupSchema);
