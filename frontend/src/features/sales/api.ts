import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../lib/baseQuery';

export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Sale'],
    endpoints: (b) => ({
        get: b.query<any, number>({
            query: (id) => ({ url: `/sales/${id}`, method: 'GET'}),
        }),
        list: b.query<{ list: any[]; totalCupo: number }, void>({
            query: () => ({ url: '/sales', method: 'GET' }),
            providesTags: ['Sale'],
        }),
        create: b.mutation<any, any>({
            query: (body) => ({ url: '/sales', method: 'POST', body }),
            invalidatesTags: ['Sale'],
        }),
        update: b.mutation<any, { id: number; body: any }>({
            query: ({ id, body }) => ({ url: `/sales/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Sale'],
        }),
        remove: b.mutation<void, number>({
            query: (id) => ({ url: `/sales/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Sale'],
        }),
    }),
});

export const { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation, useGetQuery } = salesApi;