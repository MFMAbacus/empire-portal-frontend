import { ServiceMaker } from '@/types/service';
import { Input } from './create-reservation-rule-master-service';
import { CreateReservationRuleMasterServiceApi } from './create-reservation-rule-master-service-api';

export * from './create-reservation-rule-master-service-mock';
export * from './create-reservation-rule-master-service-api';

export const makeCreateReservationRuleMasterService: ServiceMaker<Input> = () => {
  return new CreateReservationRuleMasterServiceApi();
};