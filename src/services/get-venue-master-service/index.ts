import { ServiceMaker } from '@/types/service';
import { Input } from './get-venue-master-service';

import { GetVenueMasterServiceApi } from './get-venue-master-service-api';

export const makeGetVenueMasterService: ServiceMaker<Input> = () => {
  return new GetVenueMasterServiceApi();
};

export * from './get-venue-master-service-mock';
export * from './get-venue-master-service-api';
