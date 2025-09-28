import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

const ProjectsPage = lazy(() => import('@/pages/ProjectsPage/ProjectsPage'));
const LogsPage = lazy(() => import('@/pages/LogsPage/LogsPage'));
const DashboardPage = lazy(() =>
    import('@/pages/DashboardPage/DashboardPage').then((m) => ({default: m.DashboardPage})),
);
const NotFoundPage = lazy(() =>
    import('@/pages/NotFoundPage').then((m) => ({default: m.NotFoundPage})),
);
const ErrorGroupPage = lazy(() => import('@/pages/ErrorGroupPage/ErrorGroupPage'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage/ProjectPage'));
const LogGroupPage = lazy(() => import('@/pages/LogGroupPage/LogGroupPage'));
const LoginPage = lazy(() =>
    import('@/pages/LoginPage/LoginPage').then((m) => ({default: m.LoginPage})),
);
const SignupPage = lazy(() =>
    import('@/pages/SignupPage/SignupPage').then((m) => ({default: m.SignupPage})),
);

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
        path: '/signup',
        element: <SignupPage />,
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
