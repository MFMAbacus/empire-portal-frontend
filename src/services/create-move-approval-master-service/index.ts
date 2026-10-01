import { ServiceMaker } from '@/types/service';
import { CreateMoveApprovalInput, CreateMoveApprovalMasterServiceApi } from './create-move-approval-master-service-api';

export const makeCreateMoveApprovalMasterService: ServiceMaker<CreateMoveApprovalInput> = () => {
  return new CreateMoveApprovalMasterServiceApi();
};

export * from './create-move-approval-master-service-api';
