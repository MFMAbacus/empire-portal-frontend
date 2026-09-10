import { ServiceMaker } from '@/types/service';
import { Input } from './create-item-type-master-service';

import { CreateItemTypeMasterServiceApi } from './create-item-type-master-service-api';

export const makeCreateItemTypeMasterService: ServiceMaker<Input> = () => {
  return new CreateItemTypeMasterServiceApi();
};

export * from './create-item-type-master-service-mock';
export * from './create-item-type-master-service-api';