import {useCallback, useEffect, useState} from 'react';
import {Project} from '@/entities/project/model/types';
import {fetchProjects} from '@/entities/project/api/fetchProjects';

interface UseProjectsProps {
    initialPage?: number;
    initialPageSize?: number;
}

export const useProjects = ({initialPage = 1, initialPageSize = 50}: UseProjectsProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const handleLoadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchProjects({page, pageSize});

            setProjects(data.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        handleLoadProjects();
    }, [handleLoadProjects]);

    return {
        projects,
        loading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        handleLoadProjects,
    };
};
