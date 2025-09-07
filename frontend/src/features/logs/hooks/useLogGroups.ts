import {useCallback, useEffect, useState} from 'react';
import {LogGroup} from '@/entities/log/model/types';
import {fetchLogGroups} from '@/entities/log/api/fetchLogGroups';

interface UseLogGroupsProps {
    projectId?: string;
    initialPage?: number;
    initialPageSize?: number;
}

export const useLogGroups = ({
    projectId,
    initialPage = 1,
    initialPageSize = 50,
}: UseLogGroupsProps) => {
    const [logGroups, setLogGroups] = useState<LogGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setLog] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [filters, setFilters] = useState({
        level: '',
        search: '',
        timeFrom: null,
        timeTo: null,
    });

    const handleLoad = useCallback(async () => {
        try {
            setLoading(true);
            setLog(null);

            const data = await fetchLogGroups({projectId, page, pageSize, filters});

            setLogGroups(data.items);
            setTotal(data.count);
        } catch (err) {
            setLog(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [projectId, page, pageSize, filters]);

    useEffect(() => {
        handleLoad();
    }, [handleLoad]);

    const handleFilterChange = useCallback((name: string, value: string | number | null) => {
        setFilters((prev) => ({...prev, [name]: value}));
        setPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            level: '',
            search: '',
            timeFrom: null,
            timeTo: null,
        });
    }, []);

    return {
        logGroups,
        loading,
        error,
        total,
        page,
        pageSize,
        filters,
        setPage,
        setPageSize,
        handleFilterChange,
        handleResetFilters,
        handleLoad,
    };
};
