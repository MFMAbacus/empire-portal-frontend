import { ServiceMaker } from '@/types/service';
import { CreateCourtApprovalInput, CreateCourtApprovalMasterServiceApi } from './create-court-approval-master-service-api';

export const makeCreateCourtApprovalMasterService: ServiceMaker<CreateCourtApprovalInput> = () => {
  return new CreateCourtApprovalMasterServiceApi();
};

export * from './create-court-approval-master-service-api';
