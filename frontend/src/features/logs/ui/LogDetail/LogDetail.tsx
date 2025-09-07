import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {formatDateTimeMilliseconds} from '@/shared/lib/format/formatDateMilliseconds';
import {Label} from '@gravity-ui/uikit';
import CodeBlock from '@/shared/ui/CodeBlock/CodeBlock';
import {useLog} from '@/features/logs/hooks/useLog';

interface LogDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const LogDetail = ({id}: LogDetailProps) => {
    const {log, loading, error} = useLog({id});

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!log || loading) return <DataLoader />;

    return (
        <>
            <div className="g-box g-flex" style={{justifyContent: 'space-between'}}>
                <Label theme={'info'}>{formatDateTimeMilliseconds(log.time)}</Label>
                <Label theme={'clear'} type={'copy'} copyText={id}>
                    <b>ID</b>: {id}
                </Label>
            </div>

            <CodeBlock language={'json'}>{log.context}</CodeBlock>
        </>
    );
};
