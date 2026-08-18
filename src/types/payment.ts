export type PaymentItem = {
  row: number;
  requestId: string;
  staffId: string | null;
  totalAmount: number;
  categoryName: string;
};

export type PaymentMethod = 'online' | 'cash' | 'credit';

export type Payment = {
  id: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  staffId: string | null;
  staffName: string | null;
  totalAmount: number;
  submittedAmount: number;
  requestsIds: string[];
  items: PaymentItem[];
  createdAt: string;
  method: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  isSubmitted: boolean;
  submittedAt: string | null;
  remarks: string | null;
};
