import { ServiceMaker } from '@/types/service';
import { Input } from './create-access-card-master-service';

import { CreateAccessCardMasterServiceApi } from './create-access-card-master-service-api';

export const makeCreateAccessCardMasterService: ServiceMaker<Input> = () => {
  return new CreateAccessCardMasterServiceApi();
};

export * from './create-access-card-master-service-mock';
export * from './create-access-card-master-service-api';