import { ServiceMaker } from '@/types/service';
import { Input } from './get-vehicle-type-master-service';

import { GetVehicleTypeMasterServiceApi } from './get-vehicle-type-master-service-api';

export const makeGetVehicleTypeMasterService: ServiceMaker<Input> = () => {
  return new GetVehicleTypeMasterServiceApi();
};

export * from './get-vehicle-type-master-service-mock';
export * from './get-vehicle-type-master-service-api';
