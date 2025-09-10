import {useParams} from 'react-router-dom';
import {PageContainer} from '@/shared/ui/PageContainer';
import {PaginationWithControls} from '@/shared/ui/PaginationWithControls';
import {useEffect, useState} from 'react';
import {StatBlock} from '@/shared/ui/StatBlock';
import {Divider} from '@gravity-ui/uikit';
import {useLogs} from '@/features/logs/hooks/useLogs';
import {Log} from '@/entities/log/model/types';
import {LogsFilters} from '@/features/logs/ui/LogsFilters';
import {LogGroupDetail} from '@/features/logs/ui/LogGroupDetail';
import {useLogsStats} from '@/features/logs/hooks/useLogsStats';
import {LogDetail} from '@/features/logs/ui/LogDetail';
import {LogsTable} from '@/features/logs/ui/LogsTable';

const LogGroupPage = () => {
    const {projectId, groupId} = useParams();
    const [logId, setLogId] = useState<string | undefined>(undefined);

    const {
        logs,
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
    } = useLogs({projectId, groupId});

    useEffect(() => {
        if (logs[0]) {
            setLogId(logs[0].id);
        }
    }, [logs]);

    const handleRowClick = (log: Log) => {
        setLogId(log.id);
    };

    const {stats} = useLogsStats({projectId, groupId});

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
                    <LogGroupDetail id={groupId} />

                    <Divider style={{margin: '16px 0'}} />

                    <Divider style={{margin: '16px 0'}} />

                    <LogDetail id={logId} />
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

                    <LogsFilters
                        fields={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                    />
                    <LogsTable
                        logs={logs}
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

export default LogGroupPage;
