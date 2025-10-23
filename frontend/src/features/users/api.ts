import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../lib/baseQuery';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (b) => ({
        list: b.query<any[], void>({ query: () => ({ url: '/users' }), providesTags: ['User'] }),
        create: b.mutation<any, { name:string; email:string; password:string; role:'ADMIN'|'ADVISOR' }>({
            query: (body) => ({ url: '/users', method: 'POST', body }), invalidatesTags: ['User']
        }),
        update: b.mutation<any, { id:number; body: any }>({
            query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }), invalidatesTags: ['User']
        }),
        remove: b.mutation<void, number>({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }), invalidatesTags: ['User']
        }),
    }),
});

export const { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation } = usersApi;