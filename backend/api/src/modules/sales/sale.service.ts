import { prisma } from "../../db/prisma";
import { Prisma } from "@prisma/client";

type Authed = { id: number; role: "ADMIN" | "ADVISOR" };

export async function createSale(data: any, userId: number) {
    const payload: Prisma.SaleCreateInput = {
        product: data.product,
        cupoSolicitado: new Prisma.Decimal(data.cupoSolicitado),
        franchise: data.franchise ?? null,
        tasa: data.tasa ? new Prisma.Decimal(data.tasa) : null,
        createdBy: { connect: { id: userId } },
        updatedBy: { connect: { id: userId } },
    };
    return prisma.sale.create({
        data: payload,
        include: { createdBy: { select: { id: true, name: true, email: true } } },
    });
}

export async function listSales(user: Authed) {
    const where = user.role === "ADMIN" ? {} : { createdById: user.id };
    const list = await prisma.sale.findMany({
        where,
        orderBy: { id: "desc" },
        include: { createdBy: { select: { id: true, name: true } } },
    });
    const total = await prisma.sale.aggregate({
        _sum: { cupoSolicitado: true },
        where,
    });
    return { list, totalCupo: total._sum.cupoSolicitado ?? 0 };
}

export async function getSale(id: number, user: Authed) {
    const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true } },
            updatedBy: { select: { id: true, name: true } },
        },
    });
    if (!sale) return null;
    if (user.role !== "ADMIN" && sale.createdById !== user.id) return "FORBIDDEN";
    return sale;
}

export async function updateSale(id: number, data: any, user: Authed) {
    const current = await prisma.sale.findUnique({ where: { id } });
    if (!current) return null;
    if (user.role !== "ADMIN" && current.createdById !== user.id) return "FORBIDDEN";

    return prisma.sale.update({
        where: { id },
        data: {
            ...("product" in data ? { product: data.product } : {}),
            ...("cupoSolicitado" in data ? { cupoSolicitado: new Prisma.Decimal(data.cupoSolicitado) } : {}),
            ...("franchise" in data ? { franchise: data.franchise ?? null } : {}),
            ...("tasa" in data ? { tasa: data.tasa ? new Prisma.Decimal(data.tasa) : null } : {}),
            ...("status" in data ? { status: data.status } : {}),
            updatedBy: { connect: { id: user.id } },
        },
    });
}

export async function removeSale(id: number, user: Authed) {
    const current = await prisma.sale.findUnique({ where: { id } });
    if (!current) return null;
    if (user.role !== "ADMIN" && current.createdById !== user.id) return "FORBIDDEN";
    await prisma.sale.delete({ where: { id } });
    return true;
}