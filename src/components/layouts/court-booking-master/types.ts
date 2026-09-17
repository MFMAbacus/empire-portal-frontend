export type CourtBookingFilters = {

  maxBooking?: number;
  projectCode?: string;
  advanceBooking?:number;
  pendingSlot?: boolean;
  isActive?: boolean;
  showArchived?: boolean;
};