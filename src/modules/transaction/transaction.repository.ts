import { AppError } from "../../errors/AppError.ts";
import { db } from "../../lib/db.ts";
import { TranferMoneyInput } from "./transaction.validator.ts";

export async function addMoney({ id, amount }: { id: string; amount: number }) {
  return await db.user.update({
    where: {
      id: id,
    },
    data: {
      currentBalance: {
        increment: amount,
      },
    },
  });
}

export async function fromTransaction(id: string) {
  return db.transaction.findMany({
    where: {
      fromID: id,
    },
    select: {
      amount: true,
      createdAt: true,

      userFrom: {
        select: { name: true },
      },

      userTo: {
        select: { name: true },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function ToTransaction(id: string) {
  return db.transaction.findMany({
    where: {
      toID: id,
    },
    select: {
      amount: true,
      createdAt: true,

      userFrom: {
        select: { name: true },
      },

      userTo: {
        select: { name: true },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function TransferMoneytx({
  from_id,
  to_id,
  amount,
}: TranferMoneyInput) {
  await db.$transaction(async (tx) => {
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
}
