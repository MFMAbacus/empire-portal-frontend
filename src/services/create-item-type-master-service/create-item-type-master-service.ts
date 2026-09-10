import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  itemTypeId?: string;     // Primary Key / Code Filter (e.g., "IT-01")
  itemTypeName?: string;   // Item Type / Category Name Search (e.g., "Plumbing")
  description?: string;    // Description Text Search
  isActive?: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
