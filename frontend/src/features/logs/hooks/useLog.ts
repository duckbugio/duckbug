import {useEffect, useState} from 'react';
import {Log} from '@/entities/log/model/types';
import {fetchLogById} from '@/entities/log/api/fetchLogById';

interface UseLogProps {
    id?: string | null;
}

export const useLog = ({id}: UseLogProps) => {
    const [logData, setLogData] = useState<Log | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                setLogData(await fetchLogById({id}));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        log: logData,
        loading,
        error,
    };
};
