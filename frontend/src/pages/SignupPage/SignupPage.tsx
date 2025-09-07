import {useUnit} from 'effector-react';
import {$signupError, signupFormSubmitted, signupFx} from '@/features/auth/model/authModel';
import {SignupForm} from '@/features/auth/ui/SignupForm';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert} from '@gravity-ui/uikit';

export const SignupPage = () => {
    const signup = useUnit(signupFormSubmitted);
    const navigate = useNavigate();
    const signupError = useUnit($signupError);

    useEffect(() => {
        const unsubscribe = signupFx.done.watch(() => {
            navigate('/login', {
                state: {message: 'Регистрация успешна! Теперь вы можете войти в систему.'},
            });
        });
        return () => unsubscribe();
    }, [navigate]);

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
                {signupError && (
                    <Alert
                        theme="danger"
                        style={{marginBottom: '20px'}}
                        message={`Ошибка регистрации: ${signupError.message}`}
                    />
                )}
                <SignupForm onSubmit={signup} />
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <a href="/login" style={{color: '#0066cc'}}>
                        Уже есть аккаунт? Войти
                    </a>
                </div>
            </div>
        </div>
    );
};
