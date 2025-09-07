import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {useError} from '@/features/errors/hooks/useError';
import {formatDateTimeMilliseconds} from '@/shared/lib/format/formatDateMilliseconds';
import {Card, Text as GravityText, Label} from '@gravity-ui/uikit';
import ErrorGroupTabs, {
    ErrorGroupTabsState,
} from '@/features/errors/ui/ErrorGroupTabs/ErrorGroupTabs';
import {useState} from 'react';
import JsonToTable from '@/shared/ui/JsonToTable/JsonToTable';
import CodeBlock from '@/shared/ui/CodeBlock/CodeBlock';

interface ErrorDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const ErrorDetail = ({id}: ErrorDetailProps) => {
    const {err, loading, error} = useError({id});
    const [activeTab, setActiveTab] = useState<ErrorGroupTabsState>(
        ErrorGroupTabsState.STACK_TRACE,
    );

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!err || loading) return <DataLoader />;

    return (
        <>
            <div className="g-box g-flex" style={{justifyContent: 'space-between'}}>
                <Label theme={'info'}>{formatDateTimeMilliseconds(err.time)}</Label>
                <Label theme={'clear'} type={'copy'} copyText={id}>
                    <b>ID</b>: {id}
                </Label>
            </div>

            <ErrorGroupTabs activeTab={activeTab} setActiveTab={setActiveTab} err={err} />

            {activeTab === ErrorGroupTabsState.STACK_TRACE && (
                //<StackTrace stacktrace={err.stacktrace} />
                <CodeBlock language={'json'}>{err.stacktrace}</CodeBlock>
            )}

            {activeTab === ErrorGroupTabsState.CONTEXT && (
                <CodeBlock language={'json'}>{err.context}</CodeBlock>
            )}

            {activeTab === ErrorGroupTabsState.REQUEST && (
                <>
                    <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                        <GravityText variant={'body-3'}>URL</GravityText>
                        <br />
                        {err.url}
                    </Card>

                    <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                        <GravityText variant={'body-3'}>Method</GravityText>
                        <br />
                        {err.method}
                    </Card>

                    <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                        <GravityText variant={'body-3'}>IP</GravityText>
                        <br />
                        {err.ip}
                    </Card>

                    {err.headers && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>Headers</GravityText>
                            <JsonToTable data={err.headers} />
                        </Card>
                    )}

                    {err.queryParams && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>Query Params</GravityText>
                            <JsonToTable data={err.queryParams} />
                        </Card>
                    )}

                    {err.bodyParams && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'} style={{marginTop: '16px'}}>
                                Body Params
                            </GravityText>
                            <JsonToTable data={err.bodyParams} />
                        </Card>
                    )}

                    {err.cookies && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>Cookies</GravityText>
                            <JsonToTable data={err.cookies} />
                        </Card>
                    )}

                    {err.session && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>Session</GravityText>
                            <JsonToTable data={err.session} />
                        </Card>
                    )}

                    {err.files && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>Files</GravityText>
                            <JsonToTable data={err.files} />
                        </Card>
                    )}
                </>
            )}

            {activeTab === ErrorGroupTabsState.ENV && err.env && <JsonToTable data={err.env} />}
        </>
    );
};
