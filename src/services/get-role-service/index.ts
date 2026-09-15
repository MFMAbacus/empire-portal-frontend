import { ServiceMaker } from '@/types/service';
import { Input } from './get-role-service';

import { GetUserRoleServiceApi } from './get-role-service-api';

export const makeGetUserRoleService: ServiceMaker<Input> = () => {
  return new GetUserRoleServiceApi();
};

export * from './get-role-service-mock';
export * from './get-role-service-api';
