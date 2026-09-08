import { ServiceMaker } from '@/types/service';
import { Input } from './create-vehicle-type-master-service';

import { CreateVehicleTypeMasterServiceApi } from './create-vehicle-type-master-service-api';

export const makeCreateVehicleTypeMasterService: ServiceMaker<Input> = () => {
  return new CreateVehicleTypeMasterServiceApi();
};

export * from './create-vehicle-type-master-service-mock';
export * from './create-vehicle-type-master-service-api';