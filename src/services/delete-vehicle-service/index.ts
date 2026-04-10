import {ServiceMaker} from '@/types/service';
import {Input} from './delete-vehicle-service';

import {DeleteVehicleServiceApi} from './delete-vehicle-service-api';

export const makeDeleteVehicleService: ServiceMaker<Input> = () => {
  return new DeleteVehicleServiceApi();
};

export * from './delete-vehicle-service-mock';
export * from './delete-vehicle-service-api';
