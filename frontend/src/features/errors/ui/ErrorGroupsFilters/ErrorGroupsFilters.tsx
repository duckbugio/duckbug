import {FC} from 'react';
import {ErrorGroupStatus} from '@/entities/error/model/types';
import {Button, Card, Icon, Select, TextInput} from '@gravity-ui/uikit';
import {FunnelXmark} from '@gravity-ui/icons';
import {DatePicker} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {useTranslation} from '@/shared/lib/i18n/hooks';

export interface ErrorGroupsFiltersFields {
    search: string;
    timeFrom: number | null;
    timeTo: number | null;
    status?: ErrorGroupStatus | null;
}

interface ErrorGroupsFiltersProps {
    fields: ErrorGroupsFiltersFields;
    onFilterChange: (name: keyof ErrorGroupsFiltersFields, value: string | number | null) => void;
    onResetFilters: () => void;
}

export const ErrorGroupsFilters: FC<ErrorGroupsFiltersProps> = ({
    fields,
    onFilterChange,
    onResetFilters,
}) => {
    const {t} = useTranslation();
    return (
        <Card style={{marginBottom: '24px', padding: '16px'}}>
            <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                <div style={{flex: '1', minWidth: '200px'}}>
                    <TextInput
                        placeholder={t('errors.filters.search')}
                        value={fields.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                <div style={{minWidth: '220px'}}>
                    <Select
                        placeholder={t('errors.filters.allStatuses')}
                        options={[
                            {value: 'unresolved', content: t('errors.filters.unresolved')},
                            {value: 'resolved', content: t('errors.filters.resolved')},
                            {value: 'ignored', content: t('errors.filters.ignored')},
                        ]}
                        value={fields.status ? [fields.status] : []}
                        onUpdate={(vals) =>
                            onFilterChange(
                                'status',
                                vals.length ? (vals[0] as ErrorGroupStatus) : null,
                            )
                        }
                    />
                </div>

                <DatePicker
                    placeholder={t('errors.filters.from')}
                    value={fields.timeFrom ? dateTimeParse(new Date(fields.timeFrom * 1000)) : null}
                    onUpdate={(date) =>
                        onFilterChange(
                            'timeFrom',
                            date ? Math.floor(date.toDate().getTime() / 1000) : null,
                        )
                    }
                    format="DD.MM.YYYY"
                    hasClear
                />

                <DatePicker
                    placeholder={t('errors.filters.to')}
                    value={fields.timeTo ? dateTimeParse(new Date(fields.timeTo * 1000)) : null}
                    onUpdate={(date) =>
                        onFilterChange(
                            'timeTo',
                            date ? Math.floor(date.toDate().getTime() / 1000) : null,
                        )
                    }
                    format="DD.MM.YYYY"
                    hasClear
                />

                <Button view="outlined" onClick={onResetFilters}>
                    <Icon data={FunnelXmark} /> {t('errors.filters.reset')}
                </Button>
            </div>
        </Card>
    );
};
