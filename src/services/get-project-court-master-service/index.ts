import { ServiceMaker } from '@/types/service';
import { Input } from './get-project-court-master-service';

import { GetProjectCourtMasterServiceApi } from './get-project-court-master-service-api';

export const makeGetProjectCourtMasterService: ServiceMaker<Input> = () => {
  return new GetProjectCourtMasterServiceApi();
};

export * from './get-project-court-master-service-mock';
export * from './get-project-court-master-service-api';
