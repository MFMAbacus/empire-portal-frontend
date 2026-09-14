import { ServiceMaker } from '@/types/service';
import { Input } from './create-project-venue-master-service';

import { CreateProjectVenueMasterServiceApi } from './create-project-venue-master-service-api';

export const makeCreateProjectVenueMasterService: ServiceMaker<Input> = () => {
  return new CreateProjectVenueMasterServiceApi();
};

export * from './create-project-venue-master-service-mock';
export * from './create-project-venue-master-service-api';