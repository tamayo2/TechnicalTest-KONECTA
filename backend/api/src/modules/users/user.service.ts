import { prisma } from "../../db/prisma";
import * as bcrypt from "bcrypt";

export async function createUser(data: {
    name: string; email: string; password: string; role: "ADMIN" | "ADVISOR";
}) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
        data: { name: data.name, email: data.email, role: data.role, passwordHash },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
}

export function listUsers() {
    return prisma.user.findMany({
        orderBy: { id: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
}

export function getUser(id: number) {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
}

export async function updateUser(
    id: number,
    data: Partial<{ name: string; email: string; password: string; role: "ADMIN" | "ADVISOR" }>
) {
    const payload: any = { ...data };
    if (data.password) payload.passwordHash = await bcrypt.hash(data.password, 10);
    delete payload.password;
    return prisma.user.update({
        where: { id },
        data: payload,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
}

export function removeUser(id: number) {
    return prisma.user.delete({ where: { id } });
}