import {ServiceMaker} from '@/types/service';
import {Input} from './create-user-service';

import {CreateUserServiceApi} from './create-user-service-api';

export const makeCreateUserService: ServiceMaker<Input> = () => {
  return new CreateUserServiceApi();
};

export * from './create-user-service-mock';
export * from './create-user-service-api';
