import { ServiceMaker } from '@/types/service';
import { Input } from './get-replacement-fee-master-service';

import { GetReplacementFeeMasterServiceApi } from './get-replacement-fee-master-service-api';

export const makeGetReplacementFeeMasterService: ServiceMaker<Input> = () => {
  return new GetReplacementFeeMasterServiceApi();
};

export * from './get-replacement-fee-master-service-mock';
export * from './get-replacement-fee-master-service-api';
