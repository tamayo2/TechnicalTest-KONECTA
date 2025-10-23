import { Request, Response } from "express";
import { login as loginSvc, refreshToken } from "./auth.service";
import { verifyCaptcha } from "./captcha.service";

export async function login(req: Request, res: Response) {
    const { email, password, captchaToken } = req.body;
    await verifyCaptcha(captchaToken);
    const data = await loginSvc(email, password);
    res.json(data);
}

export function refresh(req: Request, res: Response) {
    const { refreshToken: token } = req.body || {};
    if (!token) return res.status(400).json({ message: "Falta refreshToken" });
    try {
        const access = refreshToken(token);
        res.json({ access });
    } catch {
        res.status(401).json({ message: "Refresh inválido" });
    }
}