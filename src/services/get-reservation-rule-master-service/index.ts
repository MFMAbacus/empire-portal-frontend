import { ServiceMaker } from '@/types/service';
import { Input } from './get-reservation-rule-master-service';

import { GetReservationRuleMasterServiceApi } from './get-reservation-rule-master-service-api';

export const makeGetReservationRuleMasterService: ServiceMaker<Input> = () => {
  return new GetReservationRuleMasterServiceApi();
};

export * from './get-reservation-rule-master-service-mock';
export * from './get-reservation-rule-master-service-api';
