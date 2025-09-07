import {NavigateFunction} from 'react-router';
import {Text as GravityText, Icon, Label, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {getErrorGroupPath} from '@/app/url-generators';
import {ErrGroup} from '@/entities/error/model/types';
import {formatNumber} from '@/shared/lib/format/formatNumber';
import {unixToHumanReadable} from '@/shared/lib/format/formatDateMilliseconds';
import {Clock, ClockArrowRotateLeft} from '@gravity-ui/icons';

export const getErrorGroupsTableColumns = (
    projectId: string,
    navigate: NavigateFunction,
): TableColumnConfig<ErrGroup>[] => [
    {
        id: 'message',
        name: 'Ошибка',
        template: (group: ErrGroup) => (
            <>
                <Link
                    title={group.message}
                    onClick={() => navigate(getErrorGroupPath(projectId, group.id))}
                    href={''}
                >
                    {group.message}
                </Link>
                <br />
                <GravityText color="secondary">
                    <b>Строка</b>: {group.line}, <b>Файл</b>: {group.file}, <Icon data={Clock} />{' '}
                    {unixToHumanReadable(group.firstSeenAt)}
                    {group.firstSeenAt !== group.lastSeenAt && (
                        <>
                            , <Icon data={ClockArrowRotateLeft} />{' '}
                            {unixToHumanReadable(group.lastSeenAt)}
                        </>
                    )}
                </GravityText>
            </>
        ),
    },
    {
        id: 'counter',
        name: 'Событий',
        template: (group: ErrGroup) => (
            <Label size={'m'} theme={'info'}>
                {formatNumber(group.counter)}
            </Label>
        ),
        align: 'end',
    },
];
