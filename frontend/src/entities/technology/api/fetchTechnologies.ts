import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {TechnologyListSchema} from '../model';

export const fetchTechnologies = async () => {
    const response = await requestWithSchema('/technologies', TechnologyListSchema);
    return response.items;
};
