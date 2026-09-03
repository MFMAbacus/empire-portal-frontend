import { ServiceMaker } from '@/types/service';
import { Input } from './get-property-master-service';

import { GetPropertyMasterServiceApi } from './get-property-master-service-api';

export const makeGetPropertyMasterService: ServiceMaker<Input> = () => {
  return new GetPropertyMasterServiceApi();
};

export * from './get-property-master-service-mock';
export * from './get-property-master-service-api';
