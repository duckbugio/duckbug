import React from 'react';
import {
    Card,
    Table as GravityTable,
    TableColumnConfig,
    withTableSelection,
} from '@gravity-ui/uikit';

type TableProps<I> = {
    data: I[];
    columns: TableColumnConfig<I>[];
    emptyMessage: string;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableSelection: React.FC<TableProps<any>> = ({data, columns, emptyMessage}) => {
    return (
        <Card view="raised" style={{marginBottom: 16}}>
            <GravityTable
                data={data}
                columns={columns}
                emptyMessage={emptyMessage}
                verticalAlign="middle"
                wordWrap
                width={'max'}
            />
        </Card>
    );
};

export default withTableSelection(TableSelection);
