import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Log} from '@/entities/log/model/types';
import {getLogsTableColumns} from '@/features/logs/ui/LogsTable/lib/getLogsTableColumns';
import Table from '@/shared/ui/Table/Table';
import * as React from 'react';

interface LogsTableProps {
    logs: Log[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onRowClick?: (item: Log, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
}

export const LogsTable = ({logs, loading, error, onRetry, onRowClick}: LogsTableProps) => {
    if (loading) return <DataLoader />;
    if (error) return <DataFetchError errorMessage={error} onRetry={onRetry} />;

    return (
        <Table
            data={logs}
            columns={getLogsTableColumns()}
            emptyMessage="Список логов пуст"
            onRowClick={onRowClick}
        />
    );
};
