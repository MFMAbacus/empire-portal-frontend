import { ServiceMaker } from '@/types/service';
import { Input } from './create-property-management-approval-master-service';

import { CreatePropertyManagementApprovalMasterServiceApi } from './create-property-management-approval-master-service-api';

export const makeCreatePropertyManagementApprovalMasterService: ServiceMaker<Input> = () => {
  return new CreatePropertyManagementApprovalMasterServiceApi();
};

export * from './create-property-management-approval-master-service-mock';
export * from './create-property-management-approval-master-service-api';