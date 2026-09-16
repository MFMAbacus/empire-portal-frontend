export type ReservationRuleFilters = {
  slotDuration?: number;
  maxGuest?: number;
  lateArrival?: number;
  venueId?: string;
  isActive?: boolean;
  showArchived?: boolean;
};