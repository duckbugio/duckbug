import {Suspense, useState} from 'react';
import {ThemeProvider} from '@gravity-ui/uikit';
import {LOCAL_STORAGE_KEYS, THEMES} from './constants';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {Layout} from '@/widgets/Layout/Layout';
import {routes} from '@/app/routes';
import {AuthInit} from '@/features/auth/ui/AuthInit';
import {DataLoader} from '@/shared/ui/DataLoader';
import {ErrorBoundary} from '@/shared/ui/ErrorBoundary/ErrorBoundary';

const App = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
        return savedTheme ? savedTheme : THEMES.LIGHT;
    });

    const router = createBrowserRouter([
        {
            element: <Layout setTheme={setTheme} />,
            children: routes,
        },
    ]);

    return (
        <>
            <AuthInit />
            <ThemeProvider theme={theme}>
                <ErrorBoundary>
                    <Suspense fallback={<DataLoader />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </ErrorBoundary>
            </ThemeProvider>
        </>
    );
};

export default App;
