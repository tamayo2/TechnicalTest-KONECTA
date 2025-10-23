import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(50),
    captchaToken: z.string().min(1)
});