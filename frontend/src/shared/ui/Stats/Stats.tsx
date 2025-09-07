import {FC} from 'react';
import {StatBlock} from '@/shared/ui/StatBlock';

interface StatsProps {
    monthly: number;
    weekly: number;
    daily: number;
}

export const Stats: FC<StatsProps> = ({monthly, weekly, daily}) => {
    return (
        <div
            className={'g-container g-container_sr_3 g-s__px_5'}
            style={{width: '100%', padding: 0, marginBlockStart: '20px', marginBottom: '20px'}}
        >
            <div className="g-row g-row_s_3">
                <div className="g-col">
                    <StatBlock title={'Последние 24 ч'} counter={daily} />
                </div>
                <div className="g-col">
                    <StatBlock title={'Последние 7 дней'} counter={weekly} />
                </div>
                <div className="g-col">
                    <StatBlock title={'Последние 30 дней'} counter={monthly} />
                </div>
            </div>
        </div>
    );
};
