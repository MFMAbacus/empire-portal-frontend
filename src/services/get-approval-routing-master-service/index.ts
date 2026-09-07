import { ServiceMaker } from '@/types/service';
import { Input } from './get-approval-routing-master-service';

import { GetApprovalRoutingMasterServiceApi } from './get-approval-routing-master-service-api';

export const makeGetApprovalRoutingMasterService: ServiceMaker<Input> = () => {
  return new GetApprovalRoutingMasterServiceApi();
};

export * from './get-approval-routing-master-service-mock';
export * from './get-approval-routing-master-service-api';
