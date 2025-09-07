import {useParams} from 'react-router-dom';
import {PageTitle} from '@/shared/ui/PageTitle';
import {PageContainer} from '@/shared/ui/PageContainer';
import {LogsFilters} from '@/features/logs/ui/LogsFilters/LogsFilters';
import {LogsTable} from '@/features/logs/ui/LogsTable';
import {PaginationWithControls} from '@/shared/ui/PaginationWithControls';
import {useLogs} from '@/features/logs/hooks/useLogs';

const LogsPage = () => {
    const {projectId} = useParams();
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
    } = useLogs({projectId});

    return (
        <PageContainer>
            <PageTitle title={'Логи'} />
            <LogsFilters
                fields={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
            />
            <LogsTable logs={logs} loading={loading} error={error} onRetry={handleLoad} />
            <PaginationWithControls
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />
        </PageContainer>
    );
};

export default LogsPage;
