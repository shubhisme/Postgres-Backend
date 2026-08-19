import { db } from "../../lib/db.ts";
import type { TransferHitoryInput } from "../../validators/TransactionSchema/transactions.validator.ts";

export async function transferHistory({ id }: TransferHitoryInput) {
  const from_response = db.transaction.findMany({
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

  const to_response = db.transaction.findMany({
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

  const from_obj = (await from_response).map((transaction) => ({
    sender_name: transaction.userFrom.name,
    receiver_name: transaction.userTo.name,
    amount: transaction.amount,
    date:
      transaction.createdAt.toDateString() +
      " | " +
      transaction.createdAt.toTimeString(),
  }));

  const to_obj = (await to_response).map((transaction) => ({
    sender_name: transaction.userFrom.name,
    receiver_name: transaction.userTo.name,
    amount: transaction.amount,
    date:
      transaction.createdAt.toDateString() +
      " | " +
      transaction.createdAt.toTimeString(),
  }));

  return {
    sent_to: { count: (await from_response).length, from_obj },
    received_by: { count: (await to_response).length, to_obj },
  };
}