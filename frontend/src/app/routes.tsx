import ProjectsPage from '@/pages/ProjectsPage/ProjectsPage';
import LogsPage from '@/pages/LogsPage/LogsPage';
import {RouteObject} from 'react-router-dom';
import {DashboardPage} from '@/pages/DashboardPage/DashboardPage';
import {NotFoundPage} from '@/pages/NotFoundPage';
import ErrorGroupPage from '@/pages/ErrorGroupPage/ErrorGroupPage';
import ProjectPage from '@/pages/ProjectPage/ProjectPage';
import LogGroupPage from '@/pages/LogGroupPage/LogGroupPage';
import {LoginPage} from '@/pages/LoginPage/LoginPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <ProjectsPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
    },
    {
        path: '/projects',
        element: <ProjectsPage />,
    },
    {
        path: '/projects/:projectId',
        element: <ProjectPage />,
    },
    {
        path: '/projects/:projectId/error-groups/:groupId',
        element: <ErrorGroupPage />,
    },
    {
        path: '/projects/:projectId/log-groups/:groupId',
        element: <LogGroupPage />,
    },
    {
        path: '/logs',
        element: <LogsPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];
