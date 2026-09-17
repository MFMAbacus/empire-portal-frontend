import { ServiceMaker } from '@/types/service';
import { Input } from './create-facility-approval-master-service';

import { CreateFacilityApprovalMasterServiceApi } from './create-facility-approval-master-service-api';

export const makeCreateFacilityApprovalMasterService: ServiceMaker<Input> = () => {
  return new CreateFacilityApprovalMasterServiceApi();
};

export * from './create-facility-approval-master-service-mock';
export * from './create-facility-approval-master-service-api';