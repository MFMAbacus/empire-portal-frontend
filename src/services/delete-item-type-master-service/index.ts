import { ServiceMaker } from '@/types/service';
import { Input } from './delete-item-type-master-service';

import { DeleteItemTypeMasterServiceApi } from './delete-item-type-master-service-api';

export const makeDeleteItemTypeMasterService: ServiceMaker<Input> = () => {
  return new DeleteItemTypeMasterServiceApi();
};

export * from './delete-item-type-master-service-mock';
export * from './delete-item-type-master-service-api';
