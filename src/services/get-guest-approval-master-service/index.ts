import { ServiceMaker } from '@/types/service';
import { GetGuestApprovalInput, GetGuestApprovalMasterServiceApi } from './get-guest-approval-master-service-api';

export const makeGetGuestApprovalMasterService: ServiceMaker<GetGuestApprovalInput> = () => {
  return new GetGuestApprovalMasterServiceApi();
};

export * from './get-guest-approval-master-service-api';
