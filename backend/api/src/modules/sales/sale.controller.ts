import { Request, Response } from "express";
import * as svc from "./sale.service";

export async function create(req: Request, res: Response) {
    const sale = await svc.createSale(req.body, req.user!.id);
    res.status(201).json(sale);
}

export async function list(req: Request, res: Response) {
    const data = await svc.listSales(req.user!);
    res.json(data);
}

export async function get(req: Request, res: Response) {
    const out = await svc.getSale(Number(req.params.id), req.user!);
    if (out === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
    if (!out) return res.status(404).json({ message: "No encontrado" });
    res.json(out);
}

export async function update(req: Request, res: Response) {
    const out = await svc.updateSale(Number(req.params.id), req.body, req.user!);
    if (out === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
    if (!out) return res.status(404).json({ message: "No encontrado" });
    res.json(out);
}

export async function remove(req: Request, res: Response) {
    const out = await svc.removeSale(Number(req.params.id), req.user!);
    if (out === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
    if (!out) return res.status(404).json({ message: "No encontrado" });
    res.status(204).send();
}