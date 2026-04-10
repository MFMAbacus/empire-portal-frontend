import {ServiceMaker} from '@/types/service';
import {Input} from './get-customer-service';

import {GetCustomerServiceApi} from './get-customer-service-api';

export const makeGetCustomerService: ServiceMaker<Input> = () => {
  return new GetCustomerServiceApi();
};

export * from './get-customer-service-mock';
export * from './get-customer-service-api';
