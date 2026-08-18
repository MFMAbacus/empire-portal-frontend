import { RequestStatus, RequestType } from "@/types/request";

export type Filters = {
  id?: string;
  category?: string;
  customer?: string;
  unit?: string;
  assignedTo?: string;
  minDate?: string;
  maxDate?: string;
  type?: RequestType;
  status?: RequestStatus;
  approval?: "approved" | "refused";
  sortBy?: "created-at";
  sortOrder?: "asc" | "desc";
  showArchived?: boolean;
};
