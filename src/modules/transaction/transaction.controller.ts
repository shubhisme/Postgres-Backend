import { NextFunction, Request, Response } from "express";
import {
  addMoneySchema,
  tranferMoneySchema,
  transferHitorySchema,
} from "./transaction.validator.ts";
import { addMoney } from "./transaction.repository.ts";
import { transferHistory, transferMoney } from "./transaction.service.ts";

export async function addMoneyController(req: Request, res: Response) {
  const data = addMoneySchema.parse(req.body);

  const user = await addMoney(data);

  res.status(201).json({ data: user, success: true });
}

export async function transferHistoryController(req: Request, res: Response) {
  const data = transferHitorySchema.parse(req.body);

  const transfer_data = await transferHistory(data);

  res.status(200).json({ data: transfer_data, success: true });
}

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
