import {FC, useState} from 'react';
import {Icon, Menu, Theme} from '@gravity-ui/uikit';
import {ArrowRightFromSquare} from '@gravity-ui/icons';
import {AsideHeader} from '@gravity-ui/navigation';
import {Wrapper} from '@/widgets/Wrapper';
import {Navigate, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {getMenuItems} from '@/widgets/Layout/MenuItems';
import {getLogo} from '@/widgets/Layout/Logo';
import {useUnit} from 'effector-react';
import {$accessToken, $isAuthInitialized, $logout} from '@/features/auth/model/authModel';

interface LayoutProps {
    setTheme: (theme: Theme) => void;
}

export const Layout: FC<LayoutProps> = ({setTheme}) => {
    const [isCompact, setCompact] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const logo = getLogo();
    const menuItems = getMenuItems(navigate);

    const [isAuth, isInitialized, logout] = useUnit([$accessToken, $isAuthInitialized, $logout]);

    if (
        isInitialized &&
        !isAuth &&
        location.pathname !== '/login' &&
        location.pathname !== '/signup'
    ) {
        return <Navigate to="/login" replace />;
    }

    // Если пользователь не авторизован (например, на странице логина), показываем только контент без меню
    if (isInitialized && !isAuth) {
        return (
            <Wrapper setTheme={setTheme}>
                <Outlet />
            </Wrapper>
        );
    }

    return (
        <AsideHeader
            logo={logo}
            compact={isCompact}
            onChangeCompact={() => setCompact(!isCompact)}
            renderContent={() => (
                <Wrapper setTheme={setTheme}>
                    <Outlet />
                </Wrapper>
            )}
            menuItems={menuItems}
            renderFooter={() => (
                <Menu>
                    {/*<Menu.Item*/}
                    {/*    iconStart={<Icon size={16} data={Gear} />}*/}
                    {/*    title={'Item with icon'}*/}
                    {/*/>*/}
                    <Menu.Item
                        iconStart={<Icon size={16} data={ArrowRightFromSquare} />}
                        title={'Выйти'}
                        onClick={logout}
                    />
                </Menu>
            )}
        />
    );
};
