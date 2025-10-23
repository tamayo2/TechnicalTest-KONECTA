import { Router } from "express";
import { login, refresh } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { loginSchema } from "./auth.schemas";
import rateLimit from "express-rate-limit";

const r = Router();

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});
r.post("/login", loginLimiter, validate(loginSchema), login);
r.post("/refresh", refresh);
export default r;
