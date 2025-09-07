import {useEffect, useState} from 'react';
import {ErrGroup} from '@/entities/error/model/types';
import {fetchErrorGroupById} from '@/entities/error/api/fetchErrorGroupById';

interface UseErrorGroupProps {
    id?: string | null;
}

export const useErrorGroup = ({id}: UseErrorGroupProps) => {
    const [group, setGroup] = useState<ErrGroup | null>(null);
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

                setGroup(await fetchErrorGroupById({id}));
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
