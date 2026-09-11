import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  reasonId?: string;     
  reasonName?: string;  
  chargesApplicable?: boolean; 
  isActive?: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
