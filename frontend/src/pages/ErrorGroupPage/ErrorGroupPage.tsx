import {useParams} from 'react-router-dom';
import {PageContainer} from '@/shared/ui/PageContainer';
import {PaginationWithControls} from '@/shared/ui/PaginationWithControls';
import {useErrors} from '@/features/errors/hooks/useErrors';
import {ErrorsTable} from '@/features/errors/ui/ErrorsTable';
import {ErrorsFilters} from '@/features/errors/ui/ErrorsFilters';
import {ErrorDetail} from '@/features/errors/ui/ErrorDetail';
import {Err} from '@/entities/error/model/types';
import {useEffect, useState} from 'react';
import {StatBlock} from '@/shared/ui/StatBlock';
import {Divider} from '@gravity-ui/uikit';
import {ErrorGroupDetail} from '@/features/errors/ui/ErrorGroupDetail';
import {useErrorsStats} from '@/features/errors/hooks/useErrorsStats';

const ErrorGroupPage = () => {
    const {projectId, groupId} = useParams();
    const [errorId, setErrorId] = useState<string | undefined>(undefined);

    const {
        errors,
        loading,
        error,
        total,
        page,
        pageSize,
        filters,
        setPage,
        setPageSize,
        handleFilterChange,
        handleResetFilters,
        handleLoad,
    } = useErrors({projectId, groupId});

    useEffect(() => {
        if (errors[0]) {
            setErrorId(errors[0].id);
        }
    }, [errors]);

    const handleRowClick = (err: Err) => {
        setErrorId(err.id);
    };

    const {stats} = useErrorsStats({projectId, groupId});

    return (
        <PageContainer>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '20px',
                }}
            >
                <div style={{height: 'calc(100vh - 56px)', overflowY: 'auto'}}>
                    <ErrorGroupDetail id={groupId} />

                    <Divider style={{margin: '16px 0'}} />

                    <ErrorDetail id={errorId} />
                </div>
                <div style={{height: 'calc(100vh - 56px)', overflowY: 'auto'}}>
                    {stats && (
                        <>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: '16px',
                                    marginBottom: '16px',
                                }}
                            >
                                <StatBlock title={'24 ч'} counter={stats.last24h} />
                                <StatBlock title={'7 дней'} counter={stats.last7d} />
                                <StatBlock title={'30 дней'} counter={stats.last30d} />
                            </div>
                        </>
                    )}

                    <ErrorsFilters
                        fields={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                    />
                    <ErrorsTable
                        errors={errors}
                        loading={loading}
                        error={error}
                        onRetry={handleLoad}
                        onRowClick={handleRowClick}
                    />
                    <PaginationWithControls
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>
        </PageContainer>
    );
};

export default ErrorGroupPage;
