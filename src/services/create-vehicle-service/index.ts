import {ServiceMaker} from '@/types/service';
import {Input} from './create-vehicle-service';

import {CreateVehicleServiceApi} from './create-vehicle-service-api';

export const makeCreateVehicleService: ServiceMaker<Input> = () => {
  return new CreateVehicleServiceApi();
};

export * from './create-vehicle-service-mock';
export * from './create-vehicle-service-api';
