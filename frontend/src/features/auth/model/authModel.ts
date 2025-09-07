import {createEffect, createEvent, createStore, sample} from 'effector';
import {loginUser} from '../api/loginUser';
import {signupUser} from '../api/signupUser';
import {LoginCredentials, LoginResponse, SignupCredentials, SignupResponse} from '@/features/auth/types';

export const loginFx = createEffect<LoginCredentials, LoginResponse, Error>(async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
});

export const signupFx = createEffect<SignupCredentials, SignupResponse, Error>(async (credentials) => {
    const response = await signupUser(credentials);
    return response;
});

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
