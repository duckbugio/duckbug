import {apiClient} from '@/shared/api/apiClient';
import {requestWithSchema} from '@/shared/api/requestWithSchema';
import {TechnologySchema} from '../model';

export const fetchTechnologies = () =>
    requestWithSchema(apiClient.get('/technologies'), TechnologySchema.array());
