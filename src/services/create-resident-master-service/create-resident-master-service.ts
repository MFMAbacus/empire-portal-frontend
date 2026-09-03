import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  residentId: string;
  name: string;
  email: string;
  mobileNo: number;
  apartmentId: string;
  projectCode: string;
  loginUserId: string;
  residentType: string;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
