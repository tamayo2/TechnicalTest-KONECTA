import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { create, list, get, update, remove } from "./sale.controller";
import { createSaleSchema, updateSaleSchema } from "./sale.schemas";

const r = Router();
r.use(requireAuth);                       // cualquier usuario autenticado
r.post("/", validate(createSaleSchema), create);
r.get("/", list);
r.get("/:id", get);
r.put("/:id", validate(updateSaleSchema), update);
r.delete("/:id", remove);
export default r;