import {useCallback, useEffect, useState, useRef} from 'react';
import {Project} from '@/entities/project/model/types';
import {fetchProjects} from '@/entities/project/api/fetchProjects';

interface UseProjectsProps {
    initialPage?: number;
    initialPageSize?: number;
    includeStats?: boolean;
}

export const useProjects = ({initialPage = 1, initialPageSize = 50, includeStats = true}: UseProjectsProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const includeStatsRef = useRef(includeStats);

    // Update ref when includeStats changes
    useEffect(() => {
        includeStatsRef.current = includeStats;
    }, [includeStats]);

    const handleLoadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchProjects({page, pageSize, includeStats: includeStatsRef.current});

            setProjects(data.items);
            setTotal(data.count);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        handleLoadProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    return {
        projects,
        total,
        loading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        handleLoadProjects,
    };
};
