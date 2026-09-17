import { ServiceMaker } from '@/types/service';
import { Input } from './delete-facility-approval-master-service';

import { DeleteFacilityApprovalMasterServiceApi } from './delete-facility-approval-master-service-api';

export const makeDeleteFacilityApprovalMasterService: ServiceMaker<Input> = () => {
  return new DeleteFacilityApprovalMasterServiceApi();
};

export * from './delete-facility-approval-master-service-mock';
export * from './delete-facility-approval-master-service-api';
