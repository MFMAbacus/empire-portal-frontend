export type CourtOperatingFilters = {

  courtId?: string;
  day?: string;
  openTime?:string;
  closeTime?:string;
  isClosed?: boolean;
  isActive?: boolean;
  showArchived?: boolean;
};