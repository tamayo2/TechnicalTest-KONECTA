import { prisma } from "../../db/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Aseguramos tipos string y fallamos temprano si falta algo
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = (process.env.REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

if (!JWT_SECRET || !REFRESH_SECRET) {
    throw new Error("Faltan JWT_SECRET o REFRESH_SECRET en .env");
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });

    const access = jwt.sign(
        { role: user.role },
        JWT_SECRET,
        { subject: String(user.id), expiresIn: JWT_EXPIRES_IN }
    );

    const refresh = jwt.sign(
        { role: user.role },
        REFRESH_SECRET,
        { subject: String(user.id), expiresIn: REFRESH_EXPIRES_IN }
    );

    return {
        access,
        refresh,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
}

export function refreshToken(token: string) {
    const payload = jwt.verify(token, REFRESH_SECRET) as any;
    return jwt.sign(
        { role: payload.role },
        JWT_SECRET,
        { subject: payload.sub, expiresIn: JWT_EXPIRES_IN }
    );
}