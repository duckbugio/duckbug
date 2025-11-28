import {Text as GravityText, Label, TableColumnConfig} from '@gravity-ui/uikit';
import {Err} from '@/entities/error/model/types';
import {formatDateTimeMilliseconds} from '@/shared/lib/format/formatDateMilliseconds';
import {TFunction} from 'i18next';
import {LANGUAGES} from '@/app/constants';

export const getErrorsTableColumns = (
    t: TFunction,
    currentLanguage: typeof LANGUAGES[keyof typeof LANGUAGES] = LANGUAGES.RU,
): TableColumnConfig<Err>[] => {
    const locale = currentLanguage === 'en' ? 'en-US' : 'ru-RU';

    return [
        {
            id: 'message',
            name: t('errors.events'),
            template: (err: Err) => (
                <>
                    <GravityText>
                        <Label theme={'info'}>{formatDateTimeMilliseconds(err.time, locale)}</Label>
                        <GravityText style={{marginLeft: '4px'}}>{err.message}</GravityText>
                    </GravityText>
                </>
            ),
        },
    ];
};
