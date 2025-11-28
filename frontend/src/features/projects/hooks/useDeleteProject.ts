import {useCallback, useState} from 'react';
import {fetchProjectDelete} from '@/entities/project/api/fetchProjectDelete';
import {useTranslation} from '@/shared/lib/i18n/hooks';

interface UseDeleteProjectProps {
    onProjectDelete?: () => void;
}

export const useDeleteProject = ({onProjectDelete}: UseDeleteProjectProps = {}) => {
    const {t} = useTranslation();
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
                setError(err instanceof Error ? err.message : t('projects.deleteError'));
            } finally {
                setLoading(false);
            }
        },
        [onProjectDelete, t],
    );

    return {
        deleteProject,
        loading,
        error,
    };
};
