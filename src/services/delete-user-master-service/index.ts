import { ServiceMaker } from '@/types/service';
import { Input } from './delete-user-master-service';

import { DeleteUserMasterServiceApi } from './delete-user-master-service-api';

export const makeDeleteUserMasterService: ServiceMaker<Input> = () => {
  return new DeleteUserMasterServiceApi();
};

export * from './delete-user-master-service-mock';
export * from './delete-user-master-service-api';
