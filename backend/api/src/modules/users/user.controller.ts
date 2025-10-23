import { Request, Response } from "express";
import * as svc from "./user.service";

export async function create(req: Request, res: Response) {
    const u = await svc.createUser(req.body);
    res.status(201).json(u);
}

export async function list(_req: Request, res: Response) {
    res.json(await svc.listUsers());
}

export async function get(req: Request, res: Response) {
    const id = Number(req.params.id);
    const u = await svc.getUser(id);
    if (!u) return res.status(404).json({ message: "No encontrado" });
    res.json(u);
}

export async function update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const u = await svc.updateUser(id, req.body);
    res.json(u);
}

export async function remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.removeUser(id);
    res.status(204).send();
}