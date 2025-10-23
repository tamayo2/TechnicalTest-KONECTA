import { z } from "zod";

export const saleBase = z.object({
    product: z.enum(['CONSUMO','LIBRANZA','TARJETA_CREDITO']),
    cupoSolicitado: z.string().regex(/^\d{1,17}(?:\.\d{1,2})?$/),
    franchise: z.enum(['AMEX','VISA','MASTERCARD']).optional(),
    tasa: z.string().regex(/^\d{1,2}\.[0-9]{2}$/).optional(),
    status: z.enum(['ABIERTO','EN_PROCESO','FINALIZADO']).optional(),
}).superRefine((data, ctx) => {
    if (data.product === 'TARJETA_CREDITO' && !data.franchise) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'franchise es obligatorio para TARJETA_CREDITO', path: ['franchise'] });
    }
    if ((data.product === 'CONSUMO' || data.product === 'LIBRANZA') && !data.tasa) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'tasa es obligatoria para CONSUMO/LIBRANZA', path: ['tasa'] });
    }
});

export const createSaleSchema = saleBase;
export const updateSaleSchema = saleBase.partial();