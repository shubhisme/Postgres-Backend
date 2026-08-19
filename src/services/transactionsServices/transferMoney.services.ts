import { db } from "../../lib/db.ts";
import { type TranferMoneyInput } from "../../validators/TransactionSchema/transactions.validator.ts";

export async function transferMoney({
  from_id,
  to_id,
  amount,
}: TranferMoneyInput) {
  if (from_id === to_id) {
    throw new Error("Cannot transfer to yourself!");
  }

  if (amount <= 0) {
    throw new Error("Amount cannot be zero.");
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
      throw new Error("Reveicer doesnt exists...");
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
      throw new Error("Insufficient balance or sender not found");
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
