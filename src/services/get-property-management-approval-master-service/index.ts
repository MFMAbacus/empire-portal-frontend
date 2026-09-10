import { ServiceMaker } from '@/types/service';
import { Input } from './get-property-management-approval-master-service';

import { GetPropertyManagementApprovalMasterServiceApi } from './get-property-management-approval-master-service-api';

export const makeGetPropertyManagementApprovalMasterService: ServiceMaker<Input> = () => {
  return new GetPropertyManagementApprovalMasterServiceApi();
};

export * from './get-property-management-approval-master-service-mock';
export * from './get-property-management-approval-master-service-api';
