import {ServiceMaker} from '@/types/service';
import {Input} from './get-buildings-service';

import {GetBuildingsServiceApi} from './get-buildings-service-api';

export const makeGetBuildingsService: ServiceMaker<Input> = () => {
  return new GetBuildingsServiceApi();
};

export * from './get-buildings-service-mock';
export * from './get-buildings-service-api';
