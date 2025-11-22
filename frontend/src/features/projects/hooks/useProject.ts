import {useEffect, useState} from 'react';
import {Project} from '@/entities/project/model/types';
import {fetchProjectById} from '@/entities/project/api/fetchProjectById';
import {fetchProjectDsn} from '@/entities/project/api/fetchProjectDsn';
import {Technology} from '@/entities/technology/model/types';
import {fetchTechnologyById} from '@/entities/technology/api/fetchTechnologyById';

interface UseProjectProps {
    id: string;
}

export const useProject = ({id}: UseProjectProps) => {
    const [project, setProject] = useState<Project | null>(null);
    const [dsn, setDsn] = useState<string | null>(null);
    const [technology, setTechnology] = useState<Technology | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const projectData = await fetchProjectById({id: id});
                setProject(projectData);

                const dsnData = await fetchProjectDsn({id: id});
                setDsn(dsnData.dsn);

                if (projectData.technologyId) {
                    const techData = await fetchTechnologyById({id: projectData.technologyId});
                    setTechnology(techData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        project,
        dsn,
        technology,
        loading,
        error,
    };
};
