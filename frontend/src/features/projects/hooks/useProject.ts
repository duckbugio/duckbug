import {useEffect, useState} from 'react';
import {Project} from '@/entities/project/model/types';
import {fetchProjectById} from '@/entities/project/api/fetchProjectById';
import {fetchProjectDsn} from '@/entities/project/api/fetchProjectDsn';

interface UseProjectProps {
    id: string;
}

export const useProject = ({id}: UseProjectProps) => {
    const [project, setProject] = useState<Project | null>(null);
    const [dsn, setDsn] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                setProject(await fetchProjectById({id: id}));
                setDsn((await fetchProjectDsn({id: id})).dsn);
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
        loading,
        error,
    };
};
