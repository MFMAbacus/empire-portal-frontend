import { ServiceMaker } from '@/types/service';
import { Input } from './delete-property-management-approval-master-service';

import { DeletePropertyManagementApprovalMasterServiceApi } from './delete-property-management-approval-master-service-api';

export const makeDeletePropertyManagementApprovalMasterService: ServiceMaker<Input> = () => {
  return new DeletePropertyManagementApprovalMasterServiceApi();
};

export * from './delete-property-management-approval-master-service-mock';
export * from './delete-property-management-approval-master-service-api';
