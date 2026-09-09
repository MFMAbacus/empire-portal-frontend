import { ServiceMaker } from '@/types/service';
import { Input } from './create-movement-type-master-service';

import { CreateMovementTypeMasterServiceApi } from './create-movement-type-master-service-api';

export const makeCreateMovementTypeMasterService: ServiceMaker<Input> = () => {
  return new CreateMovementTypeMasterServiceApi();
};

export * from './create-movement-type-master-service-mock';
export * from './create-movement-type-master-service-api';