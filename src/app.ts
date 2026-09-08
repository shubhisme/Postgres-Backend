import express from "express";
import { type Request, type Response } from "express";
import userRouter from "./modules/user/user.router.ts";
import useAddMoney from "./modules/transaction/transaction.router.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import authRouter from "./modules/auth/auth.route.ts";
import cookieParse from "cookie-parser";
import { ExportMetrics } from "./middleware/requestMetrics.ts";

const app = express();
app.use(express.json());
app.use(cookieParse());
app.use(ExportMetrics)

app.get("/health", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

app.use("/api/auth", authRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/transactions", useAddMoney);

app.use(errorHandler);

export default app;