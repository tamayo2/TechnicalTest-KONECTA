import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { loadAuth, saveAuth, clearAuth } from './authPersist';
import { setCredentials, logout } from '../features/auth/authSlice';
const rawBase = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }: any) => {
        const token: string | undefined = (getState() as any)?.auth?.access;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extra) => {

        let result = await rawBase(args, api, extra);
        if (result.error && result.error.status === 401) {
            const state: any = (api.getState?.() as any) || {};
            const current = state.auth ?? loadAuth();
            if (current?.refresh) {
                const refreshRes = await rawBase(
                    { url: '/auth/refresh', method: 'POST', body: { refreshToken: current.refresh } },
                    api, extra
                );
                if (!refreshRes.error) {
                    const access = (refreshRes.data as any).access as string;
                    const next = { ...current, access };
                    saveAuth(next);
                    api.dispatch(setCredentials(next));
                    result = await rawBase(args, api, extra);
                } else {

                    clearAuth();
                    api.dispatch(logout());
                }
            }
        }
        return result;
    };