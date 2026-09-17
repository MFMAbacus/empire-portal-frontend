import { ServiceMaker } from '@/types/service';
import { Input } from './get-court-booking-master-service';

import { GetCourtBookingMasterServiceApi } from './get-court-booking-master-service-api';

export const makeGetCourtBookingMasterService: ServiceMaker<Input> = () => {
  return new GetCourtBookingMasterServiceApi();
};

export * from './get-court-booking-master-service-mock';
export * from './get-court-booking-master-service-api';
