import {useState} from 'react';
import {ThemeProvider} from '@gravity-ui/uikit';
import {LOCAL_STORAGE_KEYS, THEMES} from './constants';
import {RouterProvider, createBrowserRouter} from 'react-router';
import {Layout} from '@/shared/Layout/Layout';
import {routes} from '@/app/routes';
import {AuthInit} from '@/features/auth/ui/AuthInit';

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
                <RouterProvider router={router} />
            </ThemeProvider>
        </>
    );
};

export default App;
