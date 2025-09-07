import {createEffect, createEvent, createStore, sample} from 'effector';
import {loginUser} from '../api/loginUser';
import {LoginCredentials, LoginResponse} from '@/features/auth/types';

const loginFx = createEffect<LoginCredentials, LoginResponse, Error>(async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    return response;
});

const logoutFx = createEffect<void, void, Error>(async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
});

export const loginFormSubmitted = createEvent<LoginCredentials>();
export const $logout = createEvent();
export const redirectToHomeFx = createEffect<void, void>(() => {});

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

export const initAuth = createEvent();

sample({
    clock: initAuth,
    fn: () => localStorage.getItem('accessToken'),
    target: $accessToken,
});

sample({
    clock: $logout,
    target: logoutFx,
});

sample({
    clock: $accessToken.updates,
    fn: () => true,
    target: $isAuthInitialized,
});

sample({
    clock: loginFormSubmitted,
    target: loginFx,
});

sample({
    clock: loginFx.done,
    target: redirectToHomeFx,
});
