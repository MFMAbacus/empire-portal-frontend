import {ServiceMaker} from '@/types/service';
import {Input} from './get-customer-balances-service';

import {GetCustomerBalancesServiceApi} from './get-balances-projects-service-api';

export const makeGetCustomerBalancesService: ServiceMaker<Input> = () => {
  return new GetCustomerBalancesServiceApi();
};

export * from './get-customer-balances-service-mock';
export * from './get-balances-projects-service-api';
