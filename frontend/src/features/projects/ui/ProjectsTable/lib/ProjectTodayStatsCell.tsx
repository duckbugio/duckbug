import {FC} from 'react';
import {Text as GravityText} from '@gravity-ui/uikit';

interface ProjectTodayStatsCellProps {
    openErrors?: number;
    logsLast24h?: number;
}

export const ProjectTodayStatsCell: FC<ProjectTodayStatsCellProps> = ({
    openErrors,
    logsLast24h,
}) => {
    const errorsValue = openErrors ?? 0;
    const logsValue = logsLast24h ?? 0;

    return (
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{display: 'flex', gap: 6, alignItems: 'baseline'}}>
                <GravityText variant="caption-1" color="secondary">
                    Ошибки
                </GravityText>
                <GravityText variant="subheader-3">{errorsValue}</GravityText>
            </div>
            <div style={{display: 'flex', gap: 6, alignItems: 'baseline'}}>
                <GravityText variant="caption-1" color="secondary">
                    Логи
                </GravityText>
                <GravityText variant="subheader-3">{logsValue}</GravityText>
            </div>
        </div>
    );
};
