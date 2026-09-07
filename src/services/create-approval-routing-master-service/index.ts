import { ServiceMaker } from '@/types/service';
import { Input } from './create-approval-routing-master-service';

import { CreateApprovalRoutingMasterServiceApi } from './create-approval-routing-master-service-api';

export const makeCreateApprovalRoutingMasterService: ServiceMaker<Input> = () => {
  return new CreateApprovalRoutingMasterServiceApi();
};

export * from './create-approval-routing-master-service-mock';
export * from './create-approval-routing-master-service-api';