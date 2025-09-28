import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {NavigateFunction} from 'react-router-dom';
import {ErrGroup} from '@/entities/error/model/types';
import {getErrorGroupsTableColumns} from '@/features/errors/ui/ErrorGroupsTable/lib/getErrorGroupsTableColumns';
import TableSelection from '@/shared/ui/Table/TableSelection';
import {useState} from 'react';
import {Button, Card} from '@gravity-ui/uikit';
import {updateErrorGroupsStatus} from '@/features/errors/api/updateErrorGroupsStatus';

interface ErrorGroupsTableProps {
    projectId: string;
    errors: ErrGroup[];
    loading: boolean;
    error: string | null;
    navigate: NavigateFunction;
    onRetry: () => void;
}

export const ErrorGroupsTable = ({
    projectId,
    errors,
    loading,
    error,
    navigate,
    onRetry,
}: ErrorGroupsTableProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (loading) return <DataLoader />;
    if (error) return <DataFetchError errorMessage={error} onRetry={onRetry} />;

    return (
        <>
            <Card style={{padding: 12, marginBottom: 12}}>
                <Button
                    size="s"
                    view="outlined"
                    disabled={selectedIds.length === 0}
                    onClick={async () => {
                        await updateErrorGroupsStatus({ids: selectedIds, status: 'resolved'});
                        setSelectedIds([]);
                        onRetry();
                    }}
                >
                    Пометить выбранные как решённые
                </Button>
            </Card>
            <TableSelection
                data={errors}
                columns={getErrorGroupsTableColumns(projectId, navigate)}
                emptyMessage="Список ошибок пуст"
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                getRowDescriptor={(g: ErrGroup) => ({id: g.id})}
            />
        </>
    );
};
