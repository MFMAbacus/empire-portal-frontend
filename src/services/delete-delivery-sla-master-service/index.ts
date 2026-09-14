import { ServiceMaker } from '@/types/service';
import { Input } from './delete-delivery-sla-master-service';

import { DeleteDeliverySLAMasterServiceApi } from './delete-delivery-sla-master-service-api';

export const makeDeleteDeliverySLAMasterService: ServiceMaker<Input> = () => {
  return new DeleteDeliverySLAMasterServiceApi();
};

export * from './delete-delivery-sla-master-service-mock';
export * from './delete-delivery-sla-master-service-api';
