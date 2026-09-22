import { ServiceMaker } from '@/types/service';
import { UpdateMoveApprovalInput, UpdateMoveApprovalMasterServiceApi } from './update-move-approval-master-service-api';

export const makeUpdateMoveApprovalMasterService: ServiceMaker<UpdateMoveApprovalInput> = () => {
  return new UpdateMoveApprovalMasterServiceApi();
};

export * from './update-move-approval-master-service-api';
