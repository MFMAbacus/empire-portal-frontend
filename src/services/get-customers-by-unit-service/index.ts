import {ServiceMaker} from '@/types/service';
import {Input} from './get-customers-by-unit-service';

import {GetCustomersByUnitServiceApi} from './get-customers-by-unit-service-api';

export const makeGetCustomersByUnitService: ServiceMaker<Input> = () => {
  return new GetCustomersByUnitServiceApi();
};

export * from './get-customers-by-unit-service-mock';
export * from './get-customers-by-unit-service-api';