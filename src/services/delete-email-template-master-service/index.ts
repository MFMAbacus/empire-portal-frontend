import { ServiceMaker } from '@/types/service';
import { Input } from './delete-email-template-master-service';

import { DeleteEmailTemplateMasterServiceApi } from './delete-email-template-master-service-api';

export const makeDeleteEmailTemplateMasterService: ServiceMaker<Input> = () => {
  return new DeleteEmailTemplateMasterServiceApi();
};

export * from './delete-email-template-master-service-mock';
export * from './delete-email-template-master-service-api';
