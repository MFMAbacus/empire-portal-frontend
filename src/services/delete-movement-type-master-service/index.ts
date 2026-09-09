import { ServiceMaker } from '@/types/service';
import { Input } from './delete-movement-type-master-service';

import { DeleteMovementTypeMasterServiceApi } from './delete-movement-type-master-service-api';

export const makeDeleteMovementTypeMasterService: ServiceMaker<Input> = () => {
  return new DeleteMovementTypeMasterServiceApi();
};

export * from './delete-movement-type-master-service-mock';
export * from './delete-movement-type-master-service-api';
