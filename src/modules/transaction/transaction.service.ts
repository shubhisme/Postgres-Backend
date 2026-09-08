import { AppError } from "../../errors/AppError.ts";
import {
  addMoney,
  fromTransaction,
  ToTransaction,
  TransferMoneytx,
} from "./transaction.repository.ts";
import {
  AddMoneyInput,
  TranferMoneyInput,
  TransferHitoryInput,
} from "./transaction.validator.ts";

export async function addMoneyService({ id, amount }: AddMoneyInput) {
  const money = await addMoney({ id, amount });

  return money;
}

export async function transferHistory({ id }: TransferHitoryInput) {
  const from_response = await fromTransaction(id);

  const to_response = await ToTransaction(id);

  const from_obj = from_response.map((transaction) => ({
    sender_name: transaction.userFrom.name,
    receiver_name: transaction.userTo.name,
    amount: transaction.amount,
    date:
      transaction.createdAt.toDateString() +
      " | " +
      transaction.createdAt.toTimeString(),
  }));

  const to_obj = to_response.map((transaction) => ({
    sender_name: transaction.userFrom.name,
    receiver_name: transaction.userTo.name,
    amount: transaction.amount,
    date:
      transaction.createdAt.toDateString() +
      " | " +
      transaction.createdAt.toTimeString(),
  }));

  return {
    sent_to: { count: from_response.length, from_obj },
    received_by: { count: to_response.length, to_obj },
  };
}

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
  const response = await TransferMoneytx({ from_id, to_id, amount });
  return response;
}
