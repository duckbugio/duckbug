import {useForm} from 'react-hook-form';
import {Box, Button, Flex, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import type {LoginCredentials} from '../../types';

type LoginFormProps = {
    onSubmit: (payload: LoginCredentials) => void;
};

export const LoginForm = ({onSubmit}: LoginFormProps) => {
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
                Вход в систему
            </GravityText>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={3}>
                    <div>
                        <GravityText as="label" variant="subheader-2">
                            Email
                        </GravityText>
                        <TextInput
                            {...register('email', {
                                required: 'Обязательное поле',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Некорректный email',
                                },
                            })}
                            size="l"
                            placeholder="your@email.com"
                            error={errors.email?.message}
                            hasClear
                        />
                    </div>

                    <div>
                        <GravityText as="label" variant="subheader-2">
                            Пароль
                        </GravityText>
                        <TextInput
                            {...register('password', {
                                required: 'Обязательное поле',
                                minLength: {
                                    value: 6,
                                    message: 'Минимум 6 символов',
                                },
                            })}
                            type="password"
                            size="l"
                            placeholder="Пароль"
                            error={errors.password?.message}
                        />
                    </div>

                    <Button type="submit" view="action" size="l" width="max">
                        Войти
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};
