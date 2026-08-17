import { type NextFunction, type Request, type Response } from "express";
import { addMoney } from "../../services/transactionsServices/addMoney.services.ts";
import { addMoneySchema } from "../../validators/TransactionSchema/transactions.validator.ts";

export async function addMoneyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = addMoneySchema.parse(req.body);

    const user = await addMoney(data);

    res.status(201).json({ data: user, success: true });
  } catch (err) {
    next(err);
  }
}