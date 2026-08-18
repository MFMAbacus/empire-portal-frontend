import {ServiceMaker} from '@/types/service';
import {Input} from './invite-customer-service';

import {InviteCustomerServiceApi} from './invite-customer-service-api';

export const makeInviteCustomerService: ServiceMaker<Input> = () => {
  return new InviteCustomerServiceApi();
};

export * from './invite-customer-service-mock';
export * from './invite-customer-service-api';
