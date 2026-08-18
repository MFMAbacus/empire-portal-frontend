import {ServiceMaker} from '@/types/service';
import {Input} from './get-user-service';

import {GetUserServiceApi} from './get-user-service-api';

export const makeGetUserService: ServiceMaker<Input> = () => {
  return new GetUserServiceApi();
};

export * from './get-user-service-mock';
export * from './get-user-service-api';
