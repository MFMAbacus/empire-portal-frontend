import { ServiceMaker } from '@/types/service';
import { Input } from './get-user-master-service';

import { GetUserMasterServiceApi } from './get-user-master-service-api';

export const makeGetUserMasterService: ServiceMaker<Input> = () => {
  return new GetUserMasterServiceApi();
};

export * from './get-user-master-service-mock';
export * from './get-user-master-service-api';
