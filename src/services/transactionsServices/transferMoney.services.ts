import { AppError } from "../../errors/AppError.ts";
import { db } from "../../lib/db.ts";
import { type TranferMoneyInput } from "../../validators/TransactionSchema/transactions.validator.ts";

export async function transferMoney({
  from_id,
  to_id,
  amount,
}: TranferMoneyInput) {
  if (from_id === to_id) {
    throw new AppError("Cannot transfer to yourself!", 400);
  }

  if (amount <= 0) {
    throw new AppError("Amount cannot be zero.", 400);
  }

  const response = await db.$transaction(async (tx) => {
    // receiver exists
    const receiver = tx.user.findUnique({
      where: {
        id: to_id,
      },
      select: {
        id: true,
      },
    });

    if (!receiver) {
      throw new AppError("Reveicer doesnt exists...", 404);
    }

    // deduct money from sender
    const senderUpdate = tx.user.updateMany({
      where: {
        id: from_id,
        currentBalance: { gte: amount },
      },
      data: {
        currentBalance: {
          decrement: amount,
        },
      },
    });

    if ((await senderUpdate).count === 0) {
      throw new AppError("Insufficient balance or sender not found", 400);
    }

    // credit receiver
    const credit = tx.user.updateMany({
      where: {
        id: to_id,
      },
      data: {
        currentBalance: {
          increment: amount,
        },
      },
    });

    // record the transaction
    const transaction = tx.transaction.create({
      data: {
        fromID: from_id,
        toID: to_id,
        amount: amount,
      },
    });

    return transaction;
  });

  return response;
}
