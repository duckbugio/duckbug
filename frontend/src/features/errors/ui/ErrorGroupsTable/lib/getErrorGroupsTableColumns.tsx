import {NavigateFunction} from 'react-router-dom';
import {Text as GravityText, Icon, Label, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {getErrorGroupPath} from '@/app/url-generators';
import {ErrGroup} from '@/entities/error/model/types';
import {formatNumber} from '@/shared/lib/format/formatNumber';
import {unixToHumanReadable} from '@/shared/lib/format/formatDateMilliseconds';
import {Clock, ClockArrowRotateLeft} from '@gravity-ui/icons';
import {TFunction} from 'i18next';
import {LANGUAGES} from '@/app/constants';

export const getErrorGroupsTableColumns = (
    projectId: string,
    navigate: NavigateFunction,
    t: TFunction,
    currentLanguage: typeof LANGUAGES[keyof typeof LANGUAGES] = LANGUAGES.RU,
): TableColumnConfig<ErrGroup>[] => {
    const locale = currentLanguage === 'en' ? 'en-US' : 'ru-RU';

    return [
        {
            id: 'message',
            name: t('errors.error'),
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
                        <b>{t('errors.line')}</b>: {group.line}, <b>{t('errors.file')}</b>: {group.file}, <Icon data={Clock} />{' '}
                        {unixToHumanReadable(group.firstSeenAt, t, locale)}
                        {group.firstSeenAt !== group.lastSeenAt && (
                            <>
                                , <Icon data={ClockArrowRotateLeft} />{' '}
                                {unixToHumanReadable(group.lastSeenAt, t, locale)}
                            </>
                        )}
                    </GravityText>
                </>
            ),
        },
        {
            id: 'counter',
            name: t('errors.eventsCount'),
            template: (group: ErrGroup) => (
                <Label size={'m'} theme={'info'}>
                    {formatNumber(group.counter)}
                </Label>
            ),
            align: 'end',
        },
    ];
};
