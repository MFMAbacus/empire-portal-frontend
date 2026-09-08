import { ServiceMaker } from '@/types/service';
import { Input } from './create-gate-master-service';

import { CreateGateMasterServiceApi } from './create-gate-master-service-api';

export const makeCreateGateMasterService: ServiceMaker<Input> = () => {
  return new CreateGateMasterServiceApi();
};

export * from './create-gate-master-service-mock';
export * from './create-gate-master-service-api';