import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  id?: string;
  staffRole: string;
  projectCode: string;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
