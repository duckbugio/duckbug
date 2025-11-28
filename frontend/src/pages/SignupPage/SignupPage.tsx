import {useUnit} from 'effector-react';
import {$signupError, signupFormSubmitted, signupFx} from '@/features/auth/model/authModel';
import {SignupForm} from '@/features/auth/ui/SignupForm';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert} from '@gravity-ui/uikit';
import {useTranslation} from '@/shared/lib/i18n/hooks';

export const SignupPage = () => {
    const {t} = useTranslation();
    const signup = useUnit(signupFormSubmitted);
    const navigate = useNavigate();
    const signupError = useUnit($signupError);

    useEffect(() => {
        const unsubscribe = signupFx.done.watch(() => {
            navigate('/login', {
                state: {message: t('auth.signup.successMessage')},
            });
        });
        return () => unsubscribe();
    }, [navigate, t]);

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
                        message={`${t('auth.signup.error')}: ${signupError.message}`}
                    />
                )}
                <SignupForm onSubmit={signup} />
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <a href="/login" style={{color: '#0066cc'}}>
                        {t('auth.signup.hasAccount')}
                    </a>
                </div>
            </div>
        </div>
    );
};
