import {ServiceMaker} from '@/types/service';
import {Input} from './sign-out-service';

import {SignOutServiceApi} from './sign-out-service-api';

export const makeSignOutService: ServiceMaker<Input> = () => {
  return new SignOutServiceApi();
};

export * from './sign-out-service-mock';
export * from './sign-out-service-api';
