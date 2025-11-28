import {Briefcase} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import {TFunction} from 'i18next';

export const getMenuItems = (navigate: (path: string) => void, t: TFunction): MenuItem[] => [
    // {
    //     id: 'main',
    //     icon: House,
    //     title: t('menu.dashboard'),
    //     onItemClick: () => navigate('/'),
    // },
    {
        id: 'projects',
        icon: Briefcase,
        title: t('menu.projects'),
        onItemClick: () => navigate('/projects'),
    },
    // {
    //     id: 'logs',
    //     icon: CircleExclamation,
    //     title: t('menu.logs'),
    //     onItemClick: () => navigate('/logs'),
    // },
];
