import { ServiceMaker } from '@/types/service';
import { Input } from './get-project-venue-master-service';

import { GetProjectVenueMasterServiceApi } from './get-project-venue-master-service-api';

export const makeGetProjectVenueMasterService: ServiceMaker<Input> = () => {
  return new GetProjectVenueMasterServiceApi();
};

export * from './get-project-venue-master-service-mock';
export * from './get-project-venue-master-service-api';
