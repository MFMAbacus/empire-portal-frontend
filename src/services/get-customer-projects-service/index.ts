import {ServiceMaker} from '@/types/service';
import {Input} from './get-customer-projects-service';

import {GetCustomerProjectsServiceApi} from './get-customer-projects-service-api';

export const makeGetCustomerProjectsService: ServiceMaker<Input> = () => {
  return new GetCustomerProjectsServiceApi();
};

export * from './get-customer-projects-service-mock';
export * from './get-customer-projects-service-api';
