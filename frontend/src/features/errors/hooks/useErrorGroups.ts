import {useCallback, useEffect, useState} from 'react';
import {ErrGroup, ErrorGroupStatus} from '@/entities/error/model/types';
import {fetchErrorGroups} from '@/entities/error/api/fetchErrorGroups';

interface UseErrorGroupsProps {
    projectId?: string;
    initialPage?: number;
    initialPageSize?: number;
}

type ErrorGroupsFiltersState = {
    search: string;
    timeFrom: number | null;
    timeTo: number | null;
    status: ErrorGroupStatus | null;
};

export const useErrorGroups = ({
    projectId,
    initialPage = 1,
    initialPageSize = 50,
}: UseErrorGroupsProps) => {
    const [errorGroups, setErrorGroups] = useState<ErrGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [filters, setFilters] = useState<ErrorGroupsFiltersState>({
        search: '',
        timeFrom: null,
        timeTo: null,
        status: null,
    });

    const handleLoad = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchErrorGroups({projectId, page, pageSize, filters});

            setErrorGroups(data.items);
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
            search: '',
            timeFrom: null,
            timeTo: null,
            status: null,
        });
    }, []);

    return {
        errorGroups,
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
