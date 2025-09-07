import {Text as GravityText, Label, TableColumnConfig} from '@gravity-ui/uikit';
import {Err} from '@/entities/error/model/types';
import {formatDateTimeMilliseconds} from '@/shared/lib/format/formatDateMilliseconds';

export const getErrorsTableColumns = (): TableColumnConfig<Err>[] => [
    {
        id: 'message',
        name: 'События',
        template: (err: Err) => (
            <>
                <GravityText>
                    <Label theme={'info'}>{formatDateTimeMilliseconds(err.time)}</Label>
                    <GravityText style={{marginLeft: '4px'}}>{err.message}</GravityText>
                </GravityText>
            </>
        ),
    },
];
