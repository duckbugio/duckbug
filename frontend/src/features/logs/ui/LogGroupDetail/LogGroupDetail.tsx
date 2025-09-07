import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Text as GravityText} from '@gravity-ui/uikit';
import {formatDateTime} from '@/shared/lib/format/formatDateMilliseconds';
import {useLogGroup} from '@/features/logs/hooks/useLogGroup';

interface LogGroupDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const LogGroupDetail = ({id}: LogGroupDetailProps) => {
    const {group, loading, error} = useLogGroup({id});

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!group || loading) return <DataLoader />;

    return (
        <>
            <GravityText variant="header-1">{group.message}</GravityText>
            <div style={{margin: '8px 0 16px 0'}}>{group.level}</div>
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
