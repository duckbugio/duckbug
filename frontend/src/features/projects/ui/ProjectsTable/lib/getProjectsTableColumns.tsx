import {Project} from '@/entities/project/model/types';
import {Button, Text as GravityText, Icon, Link, TableColumnConfig} from '@gravity-ui/uikit';
import {Folder, TrashBin} from '@gravity-ui/icons';
import {NavigateFunction} from 'react-router';
import {getProjectPath} from '@/app/url-generators';

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
    },
];
