import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.router";
import userRouter from "./modules/users/user.router";
import salesRouter from "./modules/sales/sale.router";
import rateLimit from "express-rate-limit";
import {errorHandler} from "./middleware/error";
import statsRouter from "./modules/stats/stats.router";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", loginLimiter, authRouter);
app.use("/api/users", userRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stats", statsRouter);

app.use(errorHandler);
export default app;