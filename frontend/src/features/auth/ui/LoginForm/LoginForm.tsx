import {useForm} from 'react-hook-form';
import {Box, Button, Flex, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import type {LoginCredentials} from '../../types';
import {useTranslation} from '@/shared/lib/i18n/hooks';

type LoginFormProps = {
    onSubmit: (payload: LoginCredentials) => void;
};

export const LoginForm = ({onSubmit}: LoginFormProps) => {
    const {t} = useTranslation();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginCredentials>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Box maxWidth="400px">
            <GravityText variant="header-2" as="h2">
                {t('auth.login.title')}
            </GravityText>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={3}>
                    <div>
                        <GravityText as="label" variant="subheader-2">
                            {t('auth.login.email')}
                        </GravityText>
                        <TextInput
                            {...register('email', {
                                required: t('auth.login.required'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('auth.login.invalidEmail'),
                                },
                            })}
                            size="l"
                            placeholder={t('auth.login.emailPlaceholder')}
                            error={errors.email?.message}
                            hasClear
                        />
                    </div>

                    <div>
                        <GravityText as="label" variant="subheader-2">
                            {t('auth.login.password')}
                        </GravityText>
                        <TextInput
                            {...register('password', {
                                required: t('auth.login.required'),
                                minLength: {
                                    value: 6,
                                    message: t('auth.login.minPasswordLength'),
                                },
                            })}
                            type="password"
                            size="l"
                            placeholder={t('auth.login.passwordPlaceholder')}
                            error={errors.password?.message}
                        />
                    </div>

                    <Button type="submit" view="action" size="l" width="max">
                        {t('auth.login.submit')}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};
