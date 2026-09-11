import { ServiceMaker } from '@/types/service';
import { Input } from './create-card-replacement-reason-master-service';

import { CreateCardReplacementReasonMasterServiceApi } from './create-card-replacement-reason-master-service-api';

export const makeCreateCardReplacementReasonMasterService: ServiceMaker<Input> = () => {
  return new CreateCardReplacementReasonMasterServiceApi();
};

export * from './create-card-replacement-reason-master-service-mock';
export * from './create-card-replacement-reason-master-service-api';