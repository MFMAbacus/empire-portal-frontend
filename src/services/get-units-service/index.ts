import {ServiceMaker} from '@/types/service';
import {Input} from './get-units-service';

import {GetUnitsServiceApi} from './get-units-service-api';

export const makeGetUnitsService: ServiceMaker<Input> = () => {
  return new GetUnitsServiceApi();
};

export * from './get-units-service-mock';
export * from './get-units-service-api';
