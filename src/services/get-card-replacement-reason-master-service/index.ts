import { ServiceMaker } from '@/types/service';
import { Input } from './get-card-replacement-reason-master-service';

import { GetCardReplacementReasonMasterServiceApi } from './get-card-replacement-reason-master-service-api';

export const makeGetCardReplacementReasonMasterService: ServiceMaker<Input> = () => {
  return new GetCardReplacementReasonMasterServiceApi();
};

export * from './get-card-replacement-reason-master-service-mock';
export * from './get-card-replacement-reason-master-service-api';
