import {FC} from 'react';
import {StatBlock} from '@/shared/ui/StatBlock';

interface StatsProps {
    monthly: number;
    weekly: number;
    daily: number;
}

export const Stats: FC<StatsProps> = ({monthly, weekly, daily}) => {
    return (
        <div style={{width: '100%', marginBlockStart: '20px', marginBottom: '20px'}}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '16px',
                    alignItems: 'stretch',
                }}
            >
                <StatBlock title={'Последние 24 ч'} counter={daily} />
                <StatBlock title={'Последние 7 дней'} counter={weekly} />
                <StatBlock title={'Последние 30 дней'} counter={monthly} />
            </div>
        </div>
    );
};
