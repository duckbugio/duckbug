import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Text as GravityText, Label} from '@gravity-ui/uikit';
import {useErrorGroup} from '@/features/errors/hooks/useErrorGroup';
import {formatDateTime} from '@/shared/lib/format/formatDateMilliseconds';

interface ErrorGroupDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const ErrorGroupDetail = ({id}: ErrorGroupDetailProps) => {
    const {group, loading, error} = useErrorGroup({id});

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!group || loading) return <DataLoader />;

    return (
        <>
            <GravityText variant="header-1">{group.message}</GravityText>
            <div style={{margin: '8px 0 16px 0'}}>
                <Label theme={'warning'} value={group.line.toString()}>
                    {group.file}
                </Label>
            </div>
            <GravityText>
                <b>Обнаружено</b>: {formatDateTime(group.firstSeenAt)}
            </GravityText>
            <br />
            <GravityText>
                <b>Последний раз</b>: {formatDateTime(group.lastSeenAt)}
            </GravityText>
        </>
    );
};
