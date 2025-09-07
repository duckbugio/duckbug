import React from 'react';
import {Card, Table as GravityTable, TableColumnConfig} from '@gravity-ui/uikit';

type TableProps<I> = {
    data: I[];
    columns: TableColumnConfig<I>[];
    emptyMessage: string;
    onRowClick?: (item: I, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table: React.FC<TableProps<any>> = ({data, columns, emptyMessage, onRowClick}) => {
    return (
        <Card view="raised" style={{marginBottom: 16}}>
            <GravityTable
                data={data}
                columns={columns}
                emptyMessage={emptyMessage}
                verticalAlign="middle"
                wordWrap
                width={'max'}
                onRowClick={onRowClick}
            />
        </Card>
    );
};

export default Table;
