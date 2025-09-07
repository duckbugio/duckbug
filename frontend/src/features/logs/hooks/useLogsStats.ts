import {useEffect, useState} from 'react';
import {LogsStatsResponse, fetchLogsStats} from '@/entities/log/api/fetchLogsStats';

interface UseLogsStatsProps {
    projectId?: string;
    groupId?: string;
}

export const useLogsStats = ({projectId, groupId}: UseLogsStatsProps) => {
    const [stats, setStats] = useState<LogsStatsResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            setLoading(true);

            try {
                const data = await fetchLogsStats({projectId, groupId});
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
