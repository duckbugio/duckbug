import {useUnit} from 'effector-react';
import {$loginError, loginFormSubmitted, redirectToHomeFx} from '@/features/auth/model/authModel';
import {LoginForm} from '@/features/auth/ui/LoginForm';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Alert} from '@gravity-ui/uikit';

export const LoginPage = () => {
    const login = useUnit(loginFormSubmitted);
    const navigate = useNavigate();
    const location = useLocation();
    const loginError = useUnit($loginError);

    useEffect(() => {
        const unsubscribe = redirectToHomeFx.done.watch(() => {
            navigate('/');
        });
        return () => unsubscribe();
    }, [navigate]);

    const message = location.state?.message;

    return (
        <div
            style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
            }}
        >
            <div>
                {message && (
                    <Alert theme="success" style={{marginBottom: '20px'}} message={message} />
                )}
                {loginError && (
                    <Alert
                        theme="danger"
                        style={{marginBottom: '20px'}}
                        message={`Ошибка входа: ${loginError.message}`}
                    />
                )}
                <LoginForm onSubmit={login} />
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <a href="/signup" style={{color: '#0066cc'}}>
                        Нет аккаунта? Зарегистрироваться
                    </a>
                </div>
            </div>
        </div>
    );
};
