import {FC} from 'react';
import {Card, Text as GravityText} from '@gravity-ui/uikit';
import {formatNumber} from '@/shared/lib/format/formatNumber';

interface ErrorGroupsStatsProps {
    title: string;
    counter: number;
}

export const StatBlock: FC<ErrorGroupsStatsProps> = ({title, counter}) => {
    return (
        <Card size={'m'} style={{padding: '12px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <div style={{display: 'flex'}}>
                    <GravityText variant={'subheader-1'}>{title}</GravityText>
                </div>
                <GravityText variant={'display-3'} color={'info'}>
                    {formatNumber(counter)}
                </GravityText>
            </div>
        </Card>
    );
};
