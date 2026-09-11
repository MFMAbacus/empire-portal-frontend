import { ServiceMaker } from '@/types/service';
import { Input } from './delete-card-replacement-reason-master-service';

import { DeleteCardReplacementReasonMasterServiceApi } from './delete-card-replacement-reason-master-service-api';

export const makeDeleteCardReplacementReasonMasterService: ServiceMaker<Input> = () => {
  return new DeleteCardReplacementReasonMasterServiceApi();
};

export * from './delete-card-replacement-reason-master-service-mock';
export * from './delete-card-replacement-reason-master-service-api';
