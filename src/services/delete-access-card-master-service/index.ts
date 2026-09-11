import { ServiceMaker } from '@/types/service';
import { Input } from './delete-access-card-master-service';

import { DeleteAccessCardMasterServiceApi } from './delete-access-card-master-service-api';

export const makeDeleteAccessCardMasterService: ServiceMaker<Input> = () => {
  return new DeleteAccessCardMasterServiceApi();
};

export * from './delete-access-card-master-service-mock';
export * from './delete-access-card-master-service-api';
