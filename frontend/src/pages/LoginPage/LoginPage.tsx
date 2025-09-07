import {useUnit} from 'effector-react';
import {loginFormSubmitted, redirectToHomeFx} from '@/features/auth/model/authModel';
import {LoginForm} from '@/features/auth/ui/LoginForm';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const LoginPage = () => {
    const login = useUnit(loginFormSubmitted);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = redirectToHomeFx.done.watch(() => {
            navigate('/');
        });
        return () => unsubscribe();
    }, [navigate]);

    return <LoginForm onSubmit={login} />;
};
