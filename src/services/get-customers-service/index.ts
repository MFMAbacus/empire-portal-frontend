import {ServiceMaker} from '@/types/service';
import {Input} from './get-customers-service';

import {GetCustomersServiceApi} from './get-customers-service-api';

export const makeGetCustomersService: ServiceMaker<Input> = () => {
  return new GetCustomersServiceApi();
};

export * from './get-customers-service-mock';
export * from './get-customers-service-api';
