import { BuyServiceCategoryNames, UserPermissions } from "@/types/user";

export type Input = {
  sessionId: string;
  id?: string; // Optional for create, required for update
  statusCode: string;
  module: string;
  statusName: string;
  sequence: number;
  isActive: boolean;
  //serviceType?: BuyServiceCategoryNames[] | null;
  //permissions: UserPermissions;
};
