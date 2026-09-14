import { ServiceMaker } from '@/types/service';
import { Input } from './delete-venue-master-service';

import { DeleteVenueMasterServiceApi } from './delete-venue-master-service-api';

export const makeDeleteVenueMasterService: ServiceMaker<Input> = () => {
  return new DeleteVenueMasterServiceApi();
};

export * from './delete-venue-master-service-mock';
export * from './delete-venue-master-service-api';
