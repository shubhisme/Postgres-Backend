import express from "express";
import { type Request, type Response } from "express";
import userRouter from "./router/UserRouter/user.router.ts";
import useAddMoney from "./router/TransactionRouter/transaction.router.ts"

const app = express();
app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
});

app.get("/" , (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World" });
});

app.use("/api/v1/users" , userRouter);

app.use("/api/v1/transactions" , useAddMoney);

export default app;