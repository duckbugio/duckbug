import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {NavigateFunction} from 'react-router';
import TableSelection from '@/shared/ui/Table/TableSelection';
import {useState} from 'react';
import {getLogGroupsTableColumns} from '@/features/logs/ui/LogGroupsTable/lib/getLogGroupsTableColumns';
import {LogGroup} from '@/entities/log/model/types';

interface LogGroupsTableProps {
    projectId: string;
    logs: LogGroup[];
    loading: boolean;
    error: string | null;
    navigate: NavigateFunction;
    onRetry: () => void;
}

export const LogGroupsTable = ({
    projectId,
    logs,
    loading,
    error,
    navigate,
    onRetry,
}: LogGroupsTableProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (loading) return <DataLoader />;
    if (error) return <DataFetchError errorMessage={error} onRetry={onRetry} />;

    return (
        <TableSelection
            data={logs}
            columns={getLogGroupsTableColumns(projectId, navigate)}
            emptyMessage="Список логов пуст"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
        />
    );
};
