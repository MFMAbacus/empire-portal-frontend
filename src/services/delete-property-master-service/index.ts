import { ServiceMaker } from '@/types/service';
import { Input } from './delete-property-master-service';

import { DeletePropertyMasterServiceApi } from './delete-property-master-service-api';

export const makeDeletePropertyMasterService: ServiceMaker<Input> = () => {
  return new DeletePropertyMasterServiceApi();
};

export * from './delete-property-master-service-mock';
export * from './delete-property-master-service-api';
