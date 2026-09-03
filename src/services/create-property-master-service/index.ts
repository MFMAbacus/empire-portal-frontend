import { ServiceMaker } from '@/types/service';
import { Input } from './create-property-master-service';

import { CreatePropertyMasterServiceApi } from './create-property-master-service-api';

export const makeCreatePropertyMasterService: ServiceMaker<Input> = () => {
  return new CreatePropertyMasterServiceApi();
};

export * from './create-property-master-service-mock';
export * from './create-property-master-service-api';