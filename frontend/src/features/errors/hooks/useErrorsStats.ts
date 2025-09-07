import {useEffect, useState} from 'react';
import {ErrorsStatsResponse, fetchErrorsStats} from '@/entities/error/api/fetchErrorsStats';

interface UseErrorsStatsProps {
    projectId?: string;
    groupId?: string;
}

export const useErrorsStats = ({projectId, groupId}: UseErrorsStatsProps) => {
    const [stats, setStats] = useState<ErrorsStatsResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            setLoading(true);

            try {
                const data = await fetchErrorsStats({projectId, groupId});
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    return {stats, loading, error};
};
