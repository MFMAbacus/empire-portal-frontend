import {ServiceMaker} from '@/types/service';
import {Input} from './unblock-customer-service';

import {UnblockCustomerServiceApi} from './unblock-customer-service-api';

export const makeUnblockCustomerService: ServiceMaker<Input> = () => {
  return new UnblockCustomerServiceApi();
};

export * from './unblock-customer-service-mock';
export * from './unblock-customer-service-api';
