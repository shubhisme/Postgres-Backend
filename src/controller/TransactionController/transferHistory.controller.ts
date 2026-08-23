import { type Response, type Request, type NextFunction } from "express";
import { transferHitorySchema } from "../../validators/TransactionSchema/transactions.validator.ts";
import { transferHistory } from "../../services/transactionsServices/transferHistory.service.ts";

export async function transferHistoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {

    const data = transferHitorySchema.parse(req.body);

    const transfer_data = await transferHistory(data);

    res.status(200).json({ data: transfer_data, success: true });
}