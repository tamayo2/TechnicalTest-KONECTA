import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../lib/baseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (b) => ({
        login: b.mutation<
            { access: string; refresh: string; user: any },
            { email: string; password: string; captchaToken: string }
        >({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
    }),
});

export const { useLoginMutation } = authApi;