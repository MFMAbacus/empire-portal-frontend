import { ServiceMaker } from '@/types/service';
import { Input } from './delete-project-court-master-service';

import { DeleteProjectCourtMasterServiceApi } from './delete-project-court-master-service-api';

export const makeDeleteProjectCourtMasterService: ServiceMaker<Input> = () => {
  return new DeleteProjectCourtMasterServiceApi();
};

export * from './delete-project-court-master-service-mock';
export * from './delete-project-court-master-service-api';
