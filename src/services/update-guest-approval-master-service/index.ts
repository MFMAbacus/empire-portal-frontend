import { ServiceMaker } from '@/types/service';
import { UpdateGuestApprovalInput, UpdateGuestApprovalMasterServiceApi } from './update-guest-approval-master-service-api';

export const makeUpdateGuestApprovalMasterService: ServiceMaker<UpdateGuestApprovalInput> = () => {
  return new UpdateGuestApprovalMasterServiceApi();
};

export * from './update-guest-approval-master-service-api';
