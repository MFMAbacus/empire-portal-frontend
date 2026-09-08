import { ServiceMaker } from '@/types/service';
import { Input } from './delete-vehicle-type-master-service';

import { DeleteVehicleTypeMasterServiceApi } from './delete-vehicle-type-master-service-api';

export const makeDeleteVehicleTypeMasterService: ServiceMaker<Input> = () => {
  return new DeleteVehicleTypeMasterServiceApi();
};

export * from './delete-vehicle-type-master-service-mock';
export * from './delete-vehicle-type-master-service-api';
