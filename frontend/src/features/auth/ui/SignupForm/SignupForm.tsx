import {useForm} from 'react-hook-form';
import {Box, Button, Flex, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import {SignupCredentials} from '@/features/auth/types';
import {useTranslation} from '@/shared/lib/i18n/hooks';

type SignupFormProps = {
    onSubmit: (payload: SignupCredentials) => void;
};

export const SignupForm = ({onSubmit}: SignupFormProps) => {
    const {t} = useTranslation();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SignupCredentials>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Box maxWidth="400px">
            <GravityText variant="header-2" as="h2">
                {t('auth.signup.title')}
            </GravityText>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={3}>
                    <div>
                        <GravityText as="label" variant="subheader-2">
                            {t('auth.signup.email')}
                        </GravityText>
                        <TextInput
                            {...register('email', {
                                required: t('auth.signup.required'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('auth.signup.invalidEmail'),
                                },
                            })}
                            size="l"
                            placeholder={t('auth.signup.emailPlaceholder')}
                            error={errors.email?.message}
                            hasClear
                        />
                    </div>

                    <div>
                        <GravityText as="label" variant="subheader-2">
                            {t('auth.signup.password')}
                        </GravityText>
                        <TextInput
                            {...register('password', {
                                required: t('auth.signup.required'),
                                minLength: {
                                    value: 6,
                                    message: t('auth.signup.minPasswordLength'),
                                },
                            })}
                            type="password"
                            size="l"
                            placeholder={t('auth.signup.passwordPlaceholder')}
                            error={errors.password?.message}
                            hasClear
                        />
                    </div>

                    <Button type="submit" size="l" view="action">
                        {t('auth.signup.submit')}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};
