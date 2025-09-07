import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Theme, useThemeValue} from '@gravity-ui/uikit';
import {BellDot, Moon, Sun} from '@gravity-ui/icons';
import {LOCAL_STORAGE_KEYS, THEMES} from '@/app/constants';
import './Wrapper.scss';

const b = block('wrapper');

export type AppProps = {
    children: React.ReactNode;
    setTheme: (theme: Theme) => void;
};

export const Wrapper: React.FC<AppProps> = ({children, setTheme}) => {
    const theme = useThemeValue();
    const isDark = theme === THEMES.DARK;

    const handleChangeTheme = () => {
        const newTheme = isDark ? THEMES.LIGHT : THEMES.DARK;
        setTheme(newTheme);
        localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
    };

    return (
        <div className={b()}>
            <div
                className={b('theme-button')}
                style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}
            >
                <Button size="l" view="outlined">
                    <Icon data={BellDot} />
                </Button>
                <Button size="l" view="outlined" onClick={handleChangeTheme}>
                    <Icon data={isDark ? Sun : Moon} />
                </Button>
            </div>
            <div className={b('layout')}>
                <div className={b('content')}>{children}</div>
            </div>
        </div>
    );
};
