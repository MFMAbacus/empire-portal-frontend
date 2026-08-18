import {ServiceMaker} from '@/types/service';
import {Input} from './get-floors-service';

import {GetFloorsServiceApi} from './get-floors-service-api';

export const makeGetFloorsService: ServiceMaker<Input> = () => {
  return new GetFloorsServiceApi();
};

export * from './get-floors-service-mock';
export * from './get-floors-service-api';
