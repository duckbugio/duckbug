import {useEffect, useState} from 'react';
import {Err} from '@/entities/error/model/types';
import {fetchErrorById} from '@/entities/error/api/fetchErrorById';

interface UseErrorProps {
    id?: string | null;
}

export const useError = ({id}: UseErrorProps) => {
    const [errData, setErrData] = useState<Err | null>(null);
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

                setErrData(await fetchErrorById({id}));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        err: errData,
        loading,
        error,
    };
};
