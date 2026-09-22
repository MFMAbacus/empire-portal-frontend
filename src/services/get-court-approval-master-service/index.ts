import { ServiceMaker } from '@/types/service';
import { GetCourtApprovalInput, GetCourtApprovalMasterServiceApi } from './get-court-approval-master-service-api';

export const makeGetCourtApprovalMasterService: ServiceMaker<GetCourtApprovalInput> = () => {
  return new GetCourtApprovalMasterServiceApi();
};

export * from './get-court-approval-master-service-api';
