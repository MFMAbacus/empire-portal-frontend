import { ServiceMaker } from '@/types/service';
import { UpdateCourtApprovalInput, UpdateCourtApprovalMasterServiceApi } from './update-court-approval-master-service-api';

export const makeUpdateCourtApprovalMasterService: ServiceMaker<UpdateCourtApprovalInput> = () => {
  return new UpdateCourtApprovalMasterServiceApi();
};

export * from './update-court-approval-master-service-api';
