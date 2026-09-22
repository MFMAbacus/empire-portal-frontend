import { ServiceMaker } from '@/types/service';
import { GetMoveApprovalInput, GetMoveApprovalMasterServiceApi } from './get-move-approval-master-service-api';

export const makeGetMoveApprovalMasterService: ServiceMaker<GetMoveApprovalInput> = () => {
  return new GetMoveApprovalMasterServiceApi();
};

export * from './get-move-approval-master-service-api';
