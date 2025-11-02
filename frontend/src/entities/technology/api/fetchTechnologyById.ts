import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {TechnologySchema} from '../model/schemas';
import {Technology} from '../model/types';
import {ENDPOINTS} from '@/shared/api/endpoints';

interface FetchTechnologyParams {
    id: number;
}

export const fetchTechnologyById = async ({id}: FetchTechnologyParams): Promise<Technology> =>
    requestWithSchema(ENDPOINTS.technologies.byId(id), TechnologySchema);

