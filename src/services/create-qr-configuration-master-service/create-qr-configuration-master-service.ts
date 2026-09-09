import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  id?: string;
  qrConfigId?: string;
  expiryHours: number;
  isOneTimeScan: boolean;
  isGateValidation: boolean;
  isPdfRequired: boolean;
  isActive: boolean;
  isEdit?: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};