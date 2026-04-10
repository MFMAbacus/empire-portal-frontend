export type RequestItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

export type RequestStatus = "new" | "in-progress" | "on-hold" | "completed";

export type RequestUpdateType =
  | "created"
  | "approved"
  | "refused"
  | "activated"
  | "completed"
  | "rated"
  | "items-set"
  | "payment";

export type RequestUpdate = {
  id: string;
  userId: string;
  userName: string;
  type: RequestUpdateType;
  date: string;
};

type RequestRateRecord = {
  value: number;
  comment: string;
};

export type PaymentMethod = "cash" | "online" | "credit";

export type RequestPaymentRecord = {
  id: string;
  method: PaymentMethod;
  amount: number;
  date: string;
};

export type RequestVisitTime = "morning" | "afternoon";

export type RequestType = "general" | "buy" | "maintenance";

export type RequestPriority = "low" | "medium" | "hight";

export type Request = {
  id: string;
  type: RequestType;
  categoryId: string;
  categoryName: string;
  subCategoryName: string | null;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  staffId: string | null;
  staffName: string | null;
  unitId: string;
  unitName: string;
  status: RequestStatus;
  priority: RequestPriority;
  visitDate: string;
  visitTime: RequestVisitTime;
  totalPrice: number;
  totalPayments: number;
  isApproved: boolean;
  approvedAt: string | null;
  approveRemarks: string | null;
  isRefused: boolean;
  refusedAt: string | null;
  refuseRemarks: string | null;
  completedAt: string | null;
  completeRemarks: string | null;
  completeAttachments: string[];
  items: RequestItem[];
  attachments: string[];
  updates: RequestUpdate[];
  payments: RequestPaymentRecord[];
  rate: RequestRateRecord | null;
  pin: string | null;
  buyAttachments: string[];
  creationDate: string;
  isArchived: boolean;
  postedToSap: boolean | null;
};
