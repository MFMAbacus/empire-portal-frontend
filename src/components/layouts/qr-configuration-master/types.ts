export type QRConfigurationFilters = {
  qrConfigId?: string;
  expiryHours?: number;
  isOneTimeScan?: boolean;
  isGateValidation?: boolean;
  isPdfRequired?: boolean;
  isActive?: boolean;
  showArchived?: boolean;
};