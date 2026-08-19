import { type Request, type Response, type NextFunction } from "express";
import { tranferMoneySchema } from "../../validators/TransactionSchema/transactions.validator.ts";
import {transferMoney} from "../../services/transactionsServices/transferMoney.services.ts"

export async function transferMoneyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = tranferMoneySchema.parse(req.body);

    const response = await transferMoney(data);

    res.status(200).json({ data: response, success: true });
  } catch (err) {
    next(err);
  }
}
