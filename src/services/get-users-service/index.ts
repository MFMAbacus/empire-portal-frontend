import {ServiceMaker} from '@/types/service';
import {Input} from './get-users-service';

import {GetUsersServiceApi} from './get-users-service-api';

export const makeGetUsersService: ServiceMaker<Input> = () => {
  return new GetUsersServiceApi();
};

export * from './get-users-service-mock';
export * from './get-users-service-api';
