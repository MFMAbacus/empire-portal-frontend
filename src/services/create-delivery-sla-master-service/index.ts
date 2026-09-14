import { ServiceMaker } from '@/types/service';
import { Input } from './create-delivery-sla-master-service';

import { CreateDeliverySLAMasterServiceApi } from './create-delivery-sla-master-service-api';

export const makeCreateDeliverySLAMasterService: ServiceMaker<Input> = () => {
  return new CreateDeliverySLAMasterServiceApi();
};

export * from './create-delivery-sla-master-service-mock';
export * from './create-delivery-sla-master-service-api';