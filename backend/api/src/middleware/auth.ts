import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role: "ADMIN" | "ADVISOR" };
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = { id: Number(payload.sub), role: payload.role };
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

export function requireRole(...roles: Array<"ADMIN" | "ADVISOR">) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
