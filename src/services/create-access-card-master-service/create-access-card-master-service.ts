import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  cardId?: string;
  serialNo?: string;
  maskedSerial?: string;
  projectCode?: string;
  apartmentId?: string;
  residentId?: string;
  cardStatus?: string;
  issueDate?: string;
  isActive?: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
