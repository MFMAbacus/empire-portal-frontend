import { ServiceMaker } from '@/types/service';
import { Input } from './delete-reservation-rule-master-service';

import { DeleteReservationRuleMasterServiceApi } from './delete-reservation-rule-master-service-api';

export const makeDeleteReservationRuleMasterService: ServiceMaker<Input> = () => {
  return new DeleteReservationRuleMasterServiceApi();
};

export * from './delete-reservation-rule-master-service-mock';
export * from './delete-reservation-rule-master-service-api';
