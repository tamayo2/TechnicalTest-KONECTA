import { Router } from "express";
import { create, list, get, update, remove } from "./user.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createUserSchema, updateUserSchema } from "./user.schemas";

const r = Router();

// Solo ADMIN:
r.use(requireAuth, requireRole("ADMIN"));

r.post("/", validate(createUserSchema), create);
r.get("/", list);
r.get("/:id", get);
r.put("/:id", validate(updateUserSchema), update);
r.delete("/:id", remove);

export default r;
