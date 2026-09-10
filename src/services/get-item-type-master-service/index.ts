import { ServiceMaker } from '@/types/service';
import { Input } from './get-item-type-master-service';

import { GetItemTypeMasterServiceApi } from './get-item-type-master-service-api';

export const makeGetItemTypeMasterService: ServiceMaker<Input> = () => {
  return new GetItemTypeMasterServiceApi();
};

export * from './get-item-type-master-service-mock';
export * from './get-item-type-master-service-api';
