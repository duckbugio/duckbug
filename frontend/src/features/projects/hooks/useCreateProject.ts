import {fetchProjectCreate} from '@/entities/project/api/fetchProjectCreate';
import type {Project} from '@/entities/project/model/types';
import {useState} from 'react';

export const useCreateProject = (onProjectCreated: (project: Project) => void) => {
    const [loading, setLoading] = useState(false);

    const createProject = async (params: {name: string}) => {
        try {
            setLoading(true);
            const result = await fetchProjectCreate(params);
            if (result) {
                onProjectCreated(result);
            }
            setLoading(false);
        } catch (error) {
            // setError(error.message);
            setLoading(false);
        }
    };

    return {createProject, loading};
};
