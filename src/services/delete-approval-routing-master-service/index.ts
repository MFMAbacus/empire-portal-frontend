import { ServiceMaker } from '@/types/service';
import { Input } from './delete-approval-routing-master-service';

import { DeleteApprovalRoutingMasterServiceApi } from './delete-approval-routing-master-service-api';

export const makeDeleteApprovalRoutingMasterService: ServiceMaker<Input> = () => {
  return new DeleteApprovalRoutingMasterServiceApi();
};

export * from './delete-approval-routing-master-service-mock';
export * from './delete-approval-routing-master-service-api';
