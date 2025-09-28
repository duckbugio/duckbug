import {LogGroup} from '@/entities/log/model/types';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {LogGroupSchema} from '@/entities/log/model/schemas';

interface FetchLogGroupParams {
    id: string;
}

export const fetchLogGroupById = async ({id}: FetchLogGroupParams): Promise<LogGroup> =>
    requestWithSchema(`/log-groups/${id}`, LogGroupSchema);
