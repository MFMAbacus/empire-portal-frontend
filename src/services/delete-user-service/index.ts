import {ServiceMaker} from '@/types/service';
import {Input} from './delete-user-service';

import {DeleteUserServiceApi} from './delete-user-service-api';

export const makeDeleteUserService: ServiceMaker<Input> = () => {
  return new DeleteUserServiceApi();
};

export * from './delete-user-service-mock';
export * from './delete-user-service-api';
