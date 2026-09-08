import { ServiceMaker } from '@/types/service';
import { Input } from './get-gate-master-service';

import { GetGateMasterServiceApi } from './get-gate-master-service-api';

export const makeGetGateMasterService: ServiceMaker<Input> = () => {
  return new GetGateMasterServiceApi();
};

export * from './get-gate-master-service-mock';
export * from './get-gate-master-service-api';
