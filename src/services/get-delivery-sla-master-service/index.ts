import { ServiceMaker } from '@/types/service';
import { Input } from './get-delivery-sla-master-service';

import { GetDeliverySLAMasterServiceApi } from './get-delivery-sla-master-service-api';

export const makeGetDeliverySLAMasterService: ServiceMaker<Input> = () => {
  return new GetDeliverySLAMasterServiceApi();
};

export * from './get-delivery-sla-master-service-mock';
export * from './get-delivery-sla-master-service-api';
