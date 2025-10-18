import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Project} from '@/entities/project/model/types';
import {Technology} from '@/entities/technology/model/types';
import {getProjectsTableColumns} from '@/features/projects/ui/ProjectsTable/lib/getProjectsTableColumns';
import {NavigateFunction} from 'react-router-dom';
import Table from '@/shared/ui/Table/Table';

interface ProjectsListProps {
    projects: Project[];
    loading: boolean;
    error: string | null;
    navigate: NavigateFunction;
    onRetry: () => void;
    onDelete?: (id: string) => void;
    technologies?: Technology[];
}

export const ProjectsTable = ({
    projects,
    loading,
    error,
    navigate,
    onRetry,
    onDelete,
    technologies,
}: ProjectsListProps) => {
    if (loading) return <DataLoader />;
    if (error) return <DataFetchError errorMessage={error} onRetry={onRetry} />;

    return (
        <Table
            data={projects}
            columns={getProjectsTableColumns(navigate, onDelete, technologies)}
            emptyMessage="Нет доступных проектов"
        />
    );
};
