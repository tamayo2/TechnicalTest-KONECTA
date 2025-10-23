import { Router } from "express";
import { login, refresh } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { loginSchema } from "./auth.schemas";

const r = Router();
r.post("/login", validate(loginSchema), login);
r.post("/refresh", refresh);
export default r;
