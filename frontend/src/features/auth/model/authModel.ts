import {createEffect, createEvent, createStore, sample} from 'effector';
import {loginUser} from '../api/loginUser';
import {signupUser} from '../api/signupUser';
import {
    LoginCredentials,
    LoginResponse,
    SignupCredentials,
    SignupResponse,
} from '@/features/auth/types';
import {
    setAccessTokenProvider,
    setLogoutHandler,
    setRefreshTokenProvider,
    setTokensRefreshedHandler,
} from '@/shared/api/apiClient';

export const loginFx = createEffect<LoginCredentials, LoginResponse, Error>(async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
});

export const signupFx = createEffect<SignupCredentials, SignupResponse, Error>(
    async (credentials) => {
        const response = await signupUser(credentials);
        return response;
    },
);

const logoutFx = createEffect<void, void, Error>(async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
});

export const loginFormSubmitted = createEvent<LoginCredentials>();
export const signupFormSubmitted = createEvent<SignupCredentials>();
export const $logout = createEvent();

export const redirectToHomeFx = createEffect<void, void, Error>(async () => {
    // Redirect logic will be handled in components
});

export const $refreshToken = createStore<string | null>(null)
    .on(loginFx.doneData, (_, {refreshToken}) => refreshToken)
    .reset($logout);

export const $accessToken = createStore<string | null>(null)
    .on(loginFx.doneData, (_, {accessToken}) => accessToken)
    .on($logout, () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
    });

export const $isAuthInitialized = createStore(false)
    .on(loginFx.doneData, () => true)
    .on($logout, () => true);

export const $loginError = createStore<Error | null>(null)
    .on(loginFx.failData, (_, error) => error)
    .reset(loginFx);

export const $signupError = createStore<Error | null>(null)
    .on(signupFx.failData, (_, error) => error)
    .reset(signupFx);

export const initAuth = createEvent();

sample({
    clock: loginFormSubmitted,
    target: loginFx,
});

sample({
    clock: signupFormSubmitted,
    target: signupFx,
});

sample({
    clock: loginFx.done,
    target: redirectToHomeFx,
});

sample({
    clock: $logout,
    target: logoutFx,
});

sample({
    clock: initAuth,
    fn: () => localStorage.getItem('accessToken'),
    target: $accessToken,
});

sample({
    clock: $accessToken.updates,
    fn: () => true,
    target: $isAuthInitialized,
});

// Устанавливаем isAuthInitialized в true при инициализации, даже если токена нет
sample({
    clock: initAuth,
    fn: () => true,
    target: $isAuthInitialized,
});

// Зарегистрировать обработчик logout для apiClient
setLogoutHandler(() => {
    $logout();
});

// Зарегистрировать провайдеры токенов и обработчик обновления токенов
setAccessTokenProvider(() => localStorage.getItem('accessToken'));
setRefreshTokenProvider(() => localStorage.getItem('refreshToken'));
setTokensRefreshedHandler(({accessToken, refreshToken}) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
});
