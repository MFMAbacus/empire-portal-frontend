import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  venueId: string;
  projectCode: string;
  isAccess: boolean;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
