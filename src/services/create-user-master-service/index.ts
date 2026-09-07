import { ServiceMaker } from '@/types/service';
import { Input } from './create-user-master-service';

import { CreateUserMasterServiceApi } from './create-user-master-service-api';

export const makeCreateUserMasterService: ServiceMaker<Input> = () => {
  return new CreateUserMasterServiceApi();
};

export * from './create-user-master-service-mock';
export * from './create-user-master-service-api';