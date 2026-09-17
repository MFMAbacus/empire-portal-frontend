import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  blockId: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  courtId: string;
  reason: string;
  createdBy: string;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
