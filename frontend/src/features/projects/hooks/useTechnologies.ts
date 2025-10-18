import {fetchTechnologies} from '@/entities/technology/api/fetchTechnologies';
import {useEffect, useState} from 'react';
import type {Technology} from '@/entities/technology/model/types';

export const useTechnologies = () => {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchTechnologies();
            setTechnologies(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load technologies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTechnologies();
    }, []);

    return {technologies, loading, error, reload: loadTechnologies};
};
