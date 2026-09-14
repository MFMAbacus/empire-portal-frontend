import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  id?: string; // Optional for Edit service (target record primary key)
  venueId: string;
  venueName: string;
  type: string;
  projectCode: string;
  location: string;
  contact: string;
  description?: string;
  imageOrLogo?: string;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
