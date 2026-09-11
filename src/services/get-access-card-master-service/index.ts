import { ServiceMaker } from '@/types/service';
import { Input } from './get-access-card-master-service';

import { GetAccessCardMasterServiceApi } from './get-access-card-master-service-api';

export const makeGetAccessCardMasterService: ServiceMaker<Input> = () => {
  return new GetAccessCardMasterServiceApi();
};

export * from './get-access-card-master-service-mock';
export * from './get-access-card-master-service-api';
