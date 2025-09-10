import {DataFetchError} from '@/shared/ui/DataFetchError';
import {DataLoader} from '@/shared/ui/DataLoader';
import {Button, Text as GravityText, Label} from '@gravity-ui/uikit';
import {useErrorGroup} from '@/features/errors/hooks/useErrorGroup';
import {formatDateTime} from '@/shared/lib/format/formatDateMilliseconds';
import {apiClient} from '@/shared/api/apiClient';

interface ErrorGroupDetailProps {
    id?: string;
}

const handleRetry = () => {
    window.location.reload();
};

export const ErrorGroupDetail = ({id}: ErrorGroupDetailProps) => {
    const {group, loading, error, setGroup} = useErrorGroup({id});

    if (error) return <DataFetchError errorMessage={error} onRetry={handleRetry} />;
    if (!group || loading) return <DataLoader />;

    const toggleResolved = async () => {
        if (!group) return;
        const next = group.status === 'resolved' ? 'unresolved' : 'resolved';
        const res = await apiClient(`/error-groups/${group.id}/status`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({status: next}),
        });
        if (res.ok) {
            setGroup({...group, status: next});
        }
    };

    return (
        <>
            <GravityText variant="header-1">{group.message}</GravityText>
            <div style={{margin: '8px 0 16px 0'}}>
                <Label theme={'warning'} value={group.line.toString()}>
                    {group.file}
                </Label>
            </div>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: 8}}>
                <Label theme={group.status === 'resolved' ? 'success' : 'warning'}>
                    {group.status ?? 'unresolved'}
                </Label>
                <Button size="s" view="outlined" onClick={toggleResolved}>
                    {group.status === 'resolved' ? 'Вернуть в открытые' : 'Пометить как решено'}
                </Button>
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
