import {Project} from '@/entities/project/model/types';
import {Button, Text as GravityText, Icon, Label, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {CircleCheck, Folder, TrashBin} from '@gravity-ui/icons';
import {NavigateFunction} from 'react-router-dom';
import {getProjectPath} from '@/app/url-generators';
import {formatNumber} from '@/shared/lib/format/formatNumber';

export const getProjectsTableColumns = (
    navigate: NavigateFunction,
    onDelete?: (id: string) => void,
): TableColumnConfig<Project>[] => [
    {
        id: 'name',
        name: 'Название',
        template: (project: Project) => {
            const url = getProjectPath(project.id);

            return (
                <Link view="primary" href={url} onClick={() => navigate(url)}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Icon data={Folder} size={16} />
                        <GravityText variant="subheader-2">{project.name}</GravityText>
                    </div>
                </Link>
            );
        },
    },
    {
        id: 'errorsCounter',
        name: 'Ошибки',
        template: (project: Project) => {
            if (project.openErrors === 0) {
                return (
                    <Label size={'m'} theme={'success'}>
                        <Icon data={CircleCheck} size={16} />
                    </Label>
                );
            }
            
            return (
                <Label size={'m'} theme={'warning'}>
                    {formatNumber(project.openErrors ?? 0)}
                </Label>
            );
        },
        align: 'end',
    },
    {
        id: 'logsCounter',
        name: 'Логи',
        template: (project: Project) => {
            if (project.logsLast24h === 0) {
                return (
                    <Label size={'m'} theme={'success'}>
                        <Icon data={CircleCheck} size={16} />
                    </Label>
                );
            }

            return (
                <Label size={'m'} theme={'warning'}>
                    {formatNumber(project.logsLast24h ?? 0)}
                </Label>
            );
        },
        width: 80,
        align: 'end',
    },
    {
        id: 'actions',
        name: 'Действия',
        template: (project: Project) => {
            return (
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        view="outlined"
                        size="s"
                        onClick={() => onDelete?.(project.id)}
                        disabled={!onDelete}
                    >
                        <Icon data={TrashBin} size={16} />
                    </Button>
                </div>
            );
        },
        width: 80,
        align: 'end',
    },
];
