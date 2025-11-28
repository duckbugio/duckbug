import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {NavigateFunction} from 'react-router-dom';
import {ErrGroup} from '@/entities/error/model/types';
import {getErrorGroupsTableColumns} from '@/features/errors/ui/ErrorGroupsTable/lib/getErrorGroupsTableColumns';
import TableSelection from '@/shared/ui/Table/TableSelection';
import {useState} from 'react';
import {Button, Card} from '@gravity-ui/uikit';
import {updateErrorGroupsStatus} from '@/entities/error/api/updateErrorGroupsStatus';
import {useTranslation} from '@/shared/lib/i18n/hooks';

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
    const {t, currentLanguage} = useTranslation();
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
                    {t('errors.markSelectedAsResolved')}
                </Button>
            </Card>
            <TableSelection
                data={errors}
                columns={getErrorGroupsTableColumns(projectId, navigate, t, currentLanguage)}
                emptyMessage={t('errors.empty')}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                getRowDescriptor={(g: ErrGroup) => ({id: g.id})}
            />
        </>
    );
};
