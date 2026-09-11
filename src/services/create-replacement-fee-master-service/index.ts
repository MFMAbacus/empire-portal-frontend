import { ServiceMaker } from '@/types/service';
import { Input } from './create-replacement-fee-master-service';

import { CreateReplacementFeeMasterServiceApi } from './create-replacement-fee-master-service-api';

export const makeCreateReplacementFeeMasterService: ServiceMaker<Input> = () => {
  return new CreateReplacementFeeMasterServiceApi();
};

export * from './create-replacement-fee-master-service-mock';
export * from './create-replacement-fee-master-service-api';