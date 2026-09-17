import { ServiceMaker } from '@/types/service';
import { Input } from './get-facility-approval-master-service';

import { GetFacilityApprovalMasterServiceApi } from './get-facility-approval-master-service-api';

export const makeGetFacilityApprovalMasterService: ServiceMaker<Input> = () => {
  return new GetFacilityApprovalMasterServiceApi();
};

export * from './get-facility-approval-master-service-mock';
export * from './get-facility-approval-master-service-api';
