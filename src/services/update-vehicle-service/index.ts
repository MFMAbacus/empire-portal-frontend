import {ServiceMaker} from '@/types/service';
import {Input} from './update-vehicle-service';

import {UpdateVehicleServiceApi} from './update-vehicle-service-api';

export const makeEditVehicleService: ServiceMaker<Input> = () => {
  return new UpdateVehicleServiceApi();
};

export * from './update-vehicle-service-mock';
export * from './update-vehicle-service-api';
