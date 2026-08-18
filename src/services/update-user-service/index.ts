import {ServiceMaker} from '@/types/service';
import {Input} from './update-user-service';

import {UpdateUserServiceApi} from './update-user-service-api';

export const makeUpdateUserService: ServiceMaker<Input> = () => {
  return new UpdateUserServiceApi();
};

export * from './update-user-service-mock';
export * from './update-user-service-api';
