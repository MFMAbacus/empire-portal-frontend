import {ServiceMaker} from '@/types/service';
import {Input} from './update-customer-service';

import {UpdateCustomerServiceApi} from './update-customer-service-api';

export const makeUpdateCustomerService: ServiceMaker<Input> = () => {
  return new UpdateCustomerServiceApi();
};

export * from './update-customer-service-mock';
export * from './update-customer-service-api';
