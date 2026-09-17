import { ServiceMaker } from '@/types/service';
import { Input } from './delete-court-booking-master-service';

import { DeleteCourtBookingMasterServiceApi } from './delete-court-booking-master-service-api';

export const makeDeleteCourtBookingMasterService: ServiceMaker<Input> = () => {
  return new DeleteCourtBookingMasterServiceApi();
};

export * from './delete-court-booking-master-service-mock';
export * from './delete-court-booking-master-service-api';
