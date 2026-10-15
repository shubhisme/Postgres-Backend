export interface TransactionReciptJob {
  transactionIds: string;
  recipentEmail: string;
  amount: number;
  currency: "INR";
  status: "SUCCESS" | "FAILED";
}
