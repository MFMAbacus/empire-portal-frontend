import { TransactionType, TransactionStatus } from "@/types/transactions";

export type Filters = {
  id?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  amount?: string;
  subType?: string;
  transactionRefCode?: string;
  sapRefCode?: string;
  createdAt?: string;
};
