import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(1).max(50),
    email: z.string().email().max(50),
    password: z.string().min(6).max(20),
    role: z.enum(["ADMIN", "ADVISOR"]),
});

export const updateUserSchema = createUserSchema.partial();
