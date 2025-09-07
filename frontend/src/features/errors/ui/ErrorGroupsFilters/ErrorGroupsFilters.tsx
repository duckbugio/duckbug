import {FC} from 'react';
import {Button, Card, Icon, TextInput} from '@gravity-ui/uikit';
import {FunnelXmark} from '@gravity-ui/icons';
import {DatePicker} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';

export interface ErrorGroupsFiltersFields {
    search: string;
    timeFrom: number | null;
    timeTo: number | null;
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
    return (
        <Card style={{marginBottom: '24px', padding: '16px'}}>
            <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                <div style={{flex: '1', minWidth: '200px'}}>
                    <TextInput
                        placeholder="Поиск..."
                        value={fields.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                <DatePicker
                    placeholder="От"
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
                    placeholder="До"
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
                    <Icon data={FunnelXmark} /> Сбросить
                </Button>
            </div>
        </Card>
    );
};
