import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  feeId?: string;
  feeAmount?: number;
  currency?: string;
  tax?: string;
  projectCode?: string;
  isActive?: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
