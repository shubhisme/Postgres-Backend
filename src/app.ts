import express from "express";
import { type Request, type Response } from "express";
import userRouter from "./modules/user/user.router.js";
import useAddMoney from "./modules/transaction/transaction.router.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./modules/auth/auth.route.js";
import cookieParse from "cookie-parser";
import { ExportMetrics } from "./middleware/requestMetrics.js";

const app = express();
app.use(express.json());
app.use(cookieParse());
app.use(ExportMetrics);

app.get("/health", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK", instance: process.env.INSTANCE_ID });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

app.use("/api/auth", authRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/transactions", useAddMoney);

app.use(errorHandler);

export default app;
