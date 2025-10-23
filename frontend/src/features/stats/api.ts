import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../lib/baseQuery';

type Summary = {
    porAsesor: Array<{ createdById: number; _count: { _all: number } }>;
    porProducto: Array<{ product: 'CONSUMO'|'LIBRANZA'|'TARJETA_CREDITO'; _sum: { cupoSolicitado: string | number | null } }>;
    porFecha: Array<{ createdAt: string; _count: { _all: number } }>;
};

export const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (b) => ({
        summary: b.query<Summary, void>({ query: () => ({ url: '/stats/summary', method: 'GET' }) }),
    }),
});

export const { useSummaryQuery } = statsApi;