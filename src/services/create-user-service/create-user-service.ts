import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  salespersonId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  departmentId: string | null;
  employeeId: string | null;
  jobTitle: string | null;
  password: string;
  isMobileUser: boolean;
  isCachier: boolean;
  serviceType?: BuyServiceCategoryNames[] | null;
  profilePicture: string | null;
  permissions: UserPermissions;
};
