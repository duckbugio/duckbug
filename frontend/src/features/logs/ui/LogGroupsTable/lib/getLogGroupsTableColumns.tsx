import {NavigateFunction} from 'react-router';
import {Text as GravityText, Icon, Label, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {getLogGroupPath} from '@/app/url-generators';
import {LogGroup} from '@/entities/log/model/types';
import {formatNumber} from '@/shared/lib/format/formatNumber';
import {Clock, ClockArrowRotateLeft} from '@gravity-ui/icons';
import {unixToHumanReadable} from '@/shared/lib/format/formatDateMilliseconds';

export const getLogGroupsTableColumns = (
    projectId: string,
    navigate: NavigateFunction,
): TableColumnConfig<LogGroup>[] => [
    {
        id: 'level',
        name: 'Уровень',
        template: (group: LogGroup) => {
            const colors = {
                DEBUG: 'utility',
                INFO: 'info',
                WARN: 'warning',
                ERROR: 'danger',
            } as const;

            return (
                <Label theme={colors[group.level]} size="m">
                    {group.level}
                </Label>
            );
        },
        width: 80,
        align: 'center',
    },
    {
        id: 'message',
        name: 'Лог',
        width: '100%',
        template: (group: LogGroup) => {
            return (
                <>
                    <Link
                        title={group.message}
                        onClick={() => navigate(getLogGroupPath(projectId, group.id))}
                        href={''}
                        className="line3"
                    >
                        {group.message}
                    </Link>
                    <br />
                    <GravityText color="secondary">
                        <Icon data={Clock} /> {unixToHumanReadable(group.firstSeenAt)}
                        {group.firstSeenAt !== group.lastSeenAt && (
                            <>
                                , <Icon data={ClockArrowRotateLeft} />{' '}
                                {unixToHumanReadable(group.lastSeenAt)}
                            </>
                        )}
                    </GravityText>
                </>
            );
        },
    },
    {
        id: 'counter',
        name: 'Событий',
        template: (group: LogGroup) => (
            <Label size={'m'} theme={'info'}>
                {formatNumber(group.counter)}
            </Label>
        ),
        align: 'end',
    },
];
