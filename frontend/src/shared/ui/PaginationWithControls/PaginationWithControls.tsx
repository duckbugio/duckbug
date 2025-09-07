import {Text as GravityText, Pagination, Select} from '@gravity-ui/uikit';

interface PaginationWithControlsProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: {
        value: string;
        content: string;
    }[];
}

export const PaginationWithControls = ({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [
        {value: '20', content: '20 на странице'},
        {value: '50', content: '50 на странице'},
        {value: '100', content: '100 на странице'},
    ],
}: PaginationWithControlsProps) => {
    if (total === 0) return null;

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <GravityText color="secondary">
                Показано {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} из {total}
            </GravityText>

            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onUpdate={onPageChange}
                compact={true}
                showInput={false}
            />

            <Select
                value={[pageSize.toString()]}
                onUpdate={(vals) => onPageSizeChange(Number(vals[0]))}
                options={pageSizeOptions}
                size="s"
            />
        </div>
    );
};
