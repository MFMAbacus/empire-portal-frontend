export type CourtTimeFilters = {

  courtId?: string;
  startTime?:string;
  endTime?:string;
  slotDuration?: number;
  isActive?: boolean;
  showArchived?: boolean;
};