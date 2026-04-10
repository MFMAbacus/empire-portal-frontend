import {ServiceMaker} from '@/types/service';
import {Input} from './sign-in-service';

import {SignInServiceApi} from './sign-in-service-api';

export const makeSignInService: ServiceMaker<Input> = () => {
  return new SignInServiceApi();
};

export * from './sign-in-service-mock';
export * from './sign-in-service-api';
