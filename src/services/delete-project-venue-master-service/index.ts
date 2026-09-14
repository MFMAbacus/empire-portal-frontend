import { ServiceMaker } from '@/types/service';
import { Input } from './delete-project-venue-master-service';

import { DeleteProjectVenueMasterServiceApi } from './delete-project-venue-master-service-api';

export const makeDeleteProjectVenueMasterService: ServiceMaker<Input> = () => {
  return new DeleteProjectVenueMasterServiceApi();
};

export * from './delete-project-venue-master-service-mock';
export * from './delete-project-venue-master-service-api';
