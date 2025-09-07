import {useCallback, useEffect, useState} from 'react';
import {Err} from '@/entities/error/model/types';
import {fetchErrors} from '@/entities/error/api/fetchErrors';

interface UseErrorsProps {
    projectId?: string;
    groupId?: string;
    initialPage?: number;
    initialPageSize?: number;
}

export const useErrors = ({
    projectId,
    groupId,
    initialPage = 1,
    initialPageSize = 50,
}: UseErrorsProps) => {
    const [errors, setErrors] = useState<Err[]>([]);
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

            const data = await fetchErrors({projectId, groupId, page, pageSize, filters});

            setErrors(data.items);
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
        errors,
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
