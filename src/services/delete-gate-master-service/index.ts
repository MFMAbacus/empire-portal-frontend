import { ServiceMaker } from '@/types/service';
import { Input } from './delete-gate-master-service';

import { DeleteGateMasterServiceApi } from './delete-gate-master-service-api';

export const makeDeleteGateMasterService: ServiceMaker<Input> = () => {
  return new DeleteGateMasterServiceApi();
};

export * from './delete-gate-master-service-mock';
export * from './delete-gate-master-service-api';
