import {ServiceMaker} from '@/types/service';
import {Input} from './block-customer-service';

import {BlockCustomerServiceApi} from './block-customer-service-api';

export const makeBlockCustomerService: ServiceMaker<Input> = () => {
  return new BlockCustomerServiceApi();
};

export * from './block-customer-service-mock';
export * from './block-customer-service-api';
