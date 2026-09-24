import { ServiceMaker } from '@/types/service';
import { GetGuestApprovalHistoryInput, GetGuestApprovalHistoryMasterServiceApi } from './get-guest-approval-history-master-service-api';

export const makeGetGuestApprovalHistoryMasterService: ServiceMaker<GetGuestApprovalHistoryInput> = () => {
  return new GetGuestApprovalHistoryMasterServiceApi();
};

export * from './get-guest-approval-history-master-service-api';