import { ServiceMaker } from '@/types/service';
import { Input } from './create-project-court-master-service';

import { CreateProjectCourtMasterServiceApi } from './create-project-court-master-service-api';

export const makeCreateProjectCourtMasterService: ServiceMaker<Input> = () => {
  return new CreateProjectCourtMasterServiceApi();
};

export * from './create-project-court-master-service-mock';
export * from './create-project-court-master-service-api';