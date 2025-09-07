import {MenuItem} from '@gravity-ui/navigation/build/esm/components/types';
import {Briefcase} from '@gravity-ui/icons';

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
