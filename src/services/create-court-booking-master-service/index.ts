import { ServiceMaker } from '@/types/service';
import { Input } from './create-court-booking-master-service';

import { CreateCourtBookingMasterServiceApi } from './create-court-booking-master-service-api';

export const makeCreateCourtBookingMasterService: ServiceMaker<Input> = () => {
  return new CreateCourtBookingMasterServiceApi();
};

export * from './create-court-booking-master-service-mock';
export * from './create-court-booking-master-service-api';