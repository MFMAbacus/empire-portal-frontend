import { ServiceMaker } from '@/types/service';
import { Input } from './create-venue-master-service';

import { CreateVenueMasterServiceApi } from './create-venue-master-service-api';

export const makeCreateVenueMasterService: ServiceMaker<Input> = () => {
  return new CreateVenueMasterServiceApi();
};

export * from './create-venue-master-service-mock';
export * from './create-venue-master-service-api';