import {useCallback, useState} from 'react';
import {fetchProjectDelete} from '@/entities/project/api/fetchProjectDelete';

interface UseDeleteProjectProps {
    onProjectDelete?: () => void;
}

export const useDeleteProject = ({onProjectDelete}: UseDeleteProjectProps = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProject = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                setError(null);

                await fetchProjectDelete({id});

                onProjectDelete?.();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка при удалении проекта');
            } finally {
                setLoading(false);
            }
        },
        [onProjectDelete],
    );

    return {
        deleteProject,
        loading,
        error,
    };
};
