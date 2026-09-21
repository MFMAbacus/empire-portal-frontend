import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  routingId?: string;
  module: string;
  projectCode: string;
  approverRole: string | null;
  approvalLevel: string;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
