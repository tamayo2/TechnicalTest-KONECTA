import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';

const toNumber = (v: any) => (v == null ? null : Number(v));

export async function summary(_req: Request, res: Response) {
    const porAsesor = await prisma.sale.groupBy({
        by: ['createdById'],
        _count: { _all: true },
        orderBy: { createdById: 'asc' },
    });

    const porProducto = await prisma.sale.groupBy({
        by: ['product'],
        _sum: { cupoSolicitado: true },
        orderBy: { product: 'asc' },
    }).then(rows =>
        rows.map(r => ({ ...r, _sum: { cupoSolicitado: toNumber(r._sum.cupoSolicitado) } }))
    );

    const porFechaRaw: Array<{ day: Date; count: bigint }> = await prisma.$queryRaw`
    SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS count
    FROM "Sale"
    WHERE "createdAt" >= now() - interval '30 days'
    GROUP BY day
    ORDER BY day ASC;
  `;
    const porFecha = porFechaRaw.map(r => ({ day: r.day.toISOString(), count: Number(r.count) }));

    res.json({ porAsesor, porProducto, porFecha });
}