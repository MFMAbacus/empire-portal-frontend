import { TransactionType, TransactionStatus } from "@/types/transactions";

export type Filters = {
  id?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  subType?: string;
  transactionRefCode?: string;
  sapRefCode?: string;
  description?: string;
  message?: string;
};