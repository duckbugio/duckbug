import {Project} from '@/entities/project/model/types';
import {Technology} from '@/entities/technology/model/types';
import {Button, Text as GravityText, Icon, Label, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {CircleCheck, Folder, TrashBin} from '@gravity-ui/icons';
import {NavigateFunction} from 'react-router-dom';
import {getProjectPath} from '@/app/url-generators';
import {formatNumber} from '@/shared/lib/format/formatNumber';
import {TFunction} from 'i18next';

export const getProjectsTableColumns = (
    navigate: NavigateFunction,
    t: TFunction,
    onDelete?: (id: string) => void,
    technologies?: Technology[],
): TableColumnConfig<Project>[] => [
    {
        id: 'name',
        name: t('common.name'),
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
        name: t('projects.errors'),
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
    },
    {
        id: 'today',
        name: t('common.today'),
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
        name: t('projects.logs'),
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
        name: t('common.actions'),
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
    {
        id: 'technology',
        name: t('projects.technology'),
        template: (project: Project) => {
            const technology = technologies?.find((tech) => tech.id === project.technologyId);
            return <GravityText variant="body-1">{technology?.name || t('common.unknown')}</GravityText>;
        },
    },
];
