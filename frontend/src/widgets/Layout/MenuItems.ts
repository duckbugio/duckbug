import {Briefcase} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';

export const getMenuItems = (navigate: (path: string) => void): MenuItem[] => [
    // {
    //     id: 'main',
    //     icon: House,
    //     title: 'Главная',
    //     onItemClick: () => navigate('/'),
    // },
    {
        id: 'projects',
        icon: Briefcase,
        title: 'Проекты',
        onItemClick: () => navigate('/projects'),
    },
    // {
    //     id: 'logs',
    //     icon: CircleExclamation,
    //     title: 'Логи',
    //     onItemClick: () => navigate('/logs'),
    // },
];
