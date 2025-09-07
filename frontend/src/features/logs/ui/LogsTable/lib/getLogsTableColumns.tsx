import {Log} from '@/entities/log/model/types';
import {Text as GravityText, Label, TableColumnConfig} from '@gravity-ui/uikit';
import {formatDateTimeMilliseconds} from '@/shared/lib/format/formatDateMilliseconds';

export const getLogsTableColumns = (): TableColumnConfig<Log>[] => [
    {
        id: 'message',
        name: 'События',
        template: (log: Log) => (
            <>
                <GravityText>
                    <Label theme={'info'}>{formatDateTimeMilliseconds(log.time)}</Label>
                    <GravityText style={{marginLeft: '4px'}}>{log.message}</GravityText>
                </GravityText>
            </>
        ),
    },
];
