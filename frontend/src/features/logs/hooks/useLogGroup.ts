import {useEffect, useState} from 'react';
import {LogGroup} from '@/entities/log/model/types';
import {fetchLogGroupById} from '@/entities/log/api/fetchLogGroupById';

interface UseLogGroupProps {
    id?: string | null;
}

export const useLogGroup = ({id}: UseLogGroupProps) => {
    const [group, setGroup] = useState<LogGroup | null>(null);
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

                setGroup(await fetchLogGroupById({id}));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        group,
        loading,
        error,
    };
};
