import {useCallback, useEffect, useState} from 'react';
import {fetchLogs} from '@/entities/log/api/fetchLogs';
import {Log} from '@/entities/log/model/types';

interface UseLogsProps {
    projectId?: string;
    groupId?: string;
    initialPage?: number;
    initialPageSize?: number;
}

export const useLogs = ({
    projectId,
    groupId,
    initialPage = 1,
    initialPageSize = 50,
}: UseLogsProps) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            setError(null);

            const data = await fetchLogs({projectId, groupId, page, pageSize, filters});

            setLogs(data.items);
            setTotal(data.count);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
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
        logs,
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
