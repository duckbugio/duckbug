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
    getRowDescriptor?: (item: I, index: number) => {id?: string} | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableSelection: React.FC<TableProps<any>> = ({
    data,
    columns,
    emptyMessage,
    getRowDescriptor,
}) => {
    return (
        <Card view="raised" style={{marginBottom: 16}}>
            <GravityTable
                data={data}
                columns={columns}
                emptyMessage={emptyMessage}
                verticalAlign="middle"
                wordWrap
                width={'max'}
                getRowDescriptor={getRowDescriptor}
            />
        </Card>
    );
};

export default withTableSelection(TableSelection);
