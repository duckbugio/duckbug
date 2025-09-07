import {useEffect} from 'react';
import {useUnit} from 'effector-react';
import {initAuth} from '@/features/auth/model/authModel';

export const AuthInit = () => {
    const init = useUnit(initAuth);

    useEffect(() => {
        init();
    }, [init]);

    return null;
};
