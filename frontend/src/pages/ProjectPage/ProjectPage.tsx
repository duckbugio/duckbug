import {useNavigate, useParams} from 'react-router-dom';
import {PageContainer} from '@/shared/ui/PageContainer';
import {LogsFilters} from '@/features/logs/ui/LogsFilters/LogsFilters';
import {PaginationWithControls} from '@/shared/ui/PaginationWithControls';
import {Text as GravityText} from '@gravity-ui/uikit';
import {useProject} from '@/features/projects/hooks/useProject';
import {DataLoader} from '@/shared/ui/DataLoader';
import {DataFetchError} from '@/shared/ui/DataFetchError';
import QuickStart from '@/shared/ui/QuickStart/QuickStart';
import {useState} from 'react';
import ProjectTabs, {TabsState} from '@/features/projects/ui/ProjectTabs/ProjectTabs';
import {ErrorGroupsFilters} from '@/features/errors/ui/ErrorGroupsFilters';
import {ErrorGroupsTable} from '@/features/errors/ui/ErrorGroupsTable';
import {useErrorGroups} from '@/features/errors/hooks/useErrorGroups';
import {Stats} from '@/shared/ui/Stats';
import {useErrorsStats} from '@/features/errors/hooks/useErrorsStats';
import {useLogsStats} from '@/features/logs/hooks/useLogsStats';
import {LogGroupsTable} from '@/features/logs/ui/LogGroupsTable';
import {useLogGroups} from '@/features/logs/hooks/useLogGroups';

const ProjectPage = () => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabsState>(TabsState.ERRORS);
    const {project, dsn, loading, error} = useProject({id: projectId ?? ''});

    const {
        logGroups: logs,
        loading: logsLoading,
        error: logsError,
        total: logsTotal,
        page: logsPage,
        pageSize: logsPageSize,
        filters: logsFilters,
        setPage: logsSetPage,
        setPageSize: logsSetPageSize,
        handleFilterChange: logsHandleFilterChange,
        handleResetFilters: logsHandleResetFilters,
        handleLoad: logsHandleLoad,
    } = useLogGroups({projectId});

    const {
        errorGroups: errors,
        loading: errorsLoading,
        error: errorsError,
        total: errorsTotal,
        page: errorsPage,
        pageSize: errorsPageSize,
        filters: errorsFilters,
        setPage: errorsSetPage,
        setPageSize: errorsSetPageSize,
        handleFilterChange: errorsHandleFilterChange,
        handleResetFilters: errorsHandleResetFilters,
        handleLoad: errorsHandleLoad,
    } = useErrorGroups({projectId});

    const {stats: errorsStats} = useErrorsStats({projectId});
    const {stats: logsStats} = useLogsStats({projectId});

    const handleRetry = () => {
        window.location.reload();
    };

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!project || !dsn || loading) return <DataLoader />;

    return (
        <PageContainer>
            <GravityText variant="header-1">{project.name}</GravityText>

            <ProjectTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                errorsTotal={errorsTotal}
                logsTotal={logsTotal}
            />

            {activeTab === TabsState.QUICK_START && <QuickStart language={'php'} dsn={dsn} />}

            {activeTab === TabsState.ERRORS && (
                <>
                    {errorsStats && (
                        <Stats
                            monthly={errorsStats.last30d}
                            weekly={errorsStats.last7d}
                            daily={errorsStats.last24h}
                        />
                    )}

                    <ErrorGroupsFilters
                        fields={errorsFilters}
                        onFilterChange={errorsHandleFilterChange}
                        onResetFilters={errorsHandleResetFilters}
                    />
                    <ErrorGroupsTable
                        projectId={project.id}
                        errors={errors}
                        loading={errorsLoading}
                        error={errorsError}
                        navigate={navigate}
                        onRetry={errorsHandleLoad}
                    />
                    <PaginationWithControls
                        page={errorsPage}
                        pageSize={errorsPageSize}
                        total={errorsTotal}
                        onPageChange={errorsSetPage}
                        onPageSizeChange={errorsSetPageSize}
                    />
                </>
            )}

            {activeTab === TabsState.LOGS && (
                <>
                    {logsStats && (
                        <Stats
                            monthly={logsStats.last30d}
                            weekly={logsStats.last7d}
                            daily={logsStats.last24h}
                        />
                    )}

                    <LogsFilters
                        fields={logsFilters}
                        onFilterChange={logsHandleFilterChange}
                        onResetFilters={logsHandleResetFilters}
                    />
                    <LogGroupsTable
                        projectId={project.id}
                        logs={logs}
                        loading={logsLoading}
                        error={logsError}
                        navigate={navigate}
                        onRetry={logsHandleLoad}
                    />
                    <PaginationWithControls
                        page={logsPage}
                        pageSize={logsPageSize}
                        total={logsTotal}
                        onPageChange={logsSetPage}
                        onPageSizeChange={logsSetPageSize}
                    />
                </>
            )}
        </PageContainer>
    );
};

export default ProjectPage;
