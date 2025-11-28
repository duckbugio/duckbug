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
import {useTranslation} from '@/shared/lib/i18n/hooks';

interface ErrorDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const ErrorDetail = ({id}: ErrorDetailProps) => {
    const {t, currentLanguage} = useTranslation();
    const {err, loading, error} = useError({id});
    const [activeTab, setActiveTab] = useState<ErrorGroupTabsState>(
        ErrorGroupTabsState.STACK_TRACE,
    );

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!err || loading) return <DataLoader />;

    const locale = currentLanguage === 'en' ? 'en-US' : 'ru-RU';

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px'}}>
                <Label theme={'info'}>{formatDateTimeMilliseconds(err.time, locale)}</Label>
                <Label theme={'clear'} type={'copy'} copyText={id}>
                    <b>{t('errorDetail.id')}</b>: {id}
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
                        <GravityText variant={'body-3'}>{t('errorDetail.url')}</GravityText>
                        <br />
                        {err.url}
                    </Card>

                    <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                        <GravityText variant={'body-3'}>{t('errorDetail.method')}</GravityText>
                        <br />
                        {err.method}
                    </Card>

                    <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                        <GravityText variant={'body-3'}>{t('errorDetail.ip')}</GravityText>
                        <br />
                        {err.ip}
                    </Card>

                    {err.headers && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>{t('errorDetail.headers')}</GravityText>
                            <JsonToTable data={err.headers} />
                        </Card>
                    )}

                    {err.queryParams && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>{t('errorDetail.queryParams')}</GravityText>
                            <JsonToTable data={err.queryParams} />
                        </Card>
                    )}

                    {err.bodyParams && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'} style={{marginTop: '16px'}}>
                                {t('errorDetail.bodyParams')}
                            </GravityText>
                            <JsonToTable data={err.bodyParams} />
                        </Card>
                    )}

                    {err.cookies && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>{t('errorDetail.cookies')}</GravityText>
                            <JsonToTable data={err.cookies} />
                        </Card>
                    )}

                    {err.session && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>{t('errorDetail.session')}</GravityText>
                            <JsonToTable data={err.session} />
                        </Card>
                    )}

                    {err.files && (
                        <Card style={{marginTop: '16px', padding: '16px', overflow: 'auto'}}>
                            <GravityText variant={'header-1'}>{t('errorDetail.files')}</GravityText>
                            <JsonToTable data={err.files} />
                        </Card>
                    )}
                </>
            )}

            {activeTab === ErrorGroupTabsState.ENV && err.env && <JsonToTable data={err.env} />}
        </>
    );
};
