import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Err} from '@/entities/error/model/types';
import {getErrorsTableColumns} from '@/features/errors/ui/ErrorsTable/lib/getErrorsTableColumns';
import Table from '@/shared/ui/Table/Table';
import * as React from 'react';
import {useTranslation} from '@/shared/lib/i18n/hooks';

interface ErrorsTableProps {
    errors: Err[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onRowClick?: (item: Err, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
}

export const ErrorsTable = ({errors, loading, error, onRetry, onRowClick}: ErrorsTableProps) => {
    const {t, currentLanguage} = useTranslation();
    if (loading) return <DataLoader />;
    if (error) return <DataFetchError errorMessage={error} onRetry={onRetry} />;

    return (
        <Table
            data={errors}
            columns={getErrorsTableColumns(t, currentLanguage)}
            emptyMessage={t('errors.empty')}
            onRowClick={onRowClick}
        />
    );
};
