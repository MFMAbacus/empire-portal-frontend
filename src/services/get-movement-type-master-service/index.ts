import { ServiceMaker } from '@/types/service';
import { Input } from './get-movement-type-master-service';

import { GetMovementTypeMasterServiceApi } from './get-movement-type-master-service-api';

export const makeGetMovementTypeMasterService: ServiceMaker<Input> = () => {
  return new GetMovementTypeMasterServiceApi();
};

export * from './get-movement-type-master-service-mock';
export * from './get-movement-type-master-service-api';
