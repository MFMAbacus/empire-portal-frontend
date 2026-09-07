import { ServiceMaker } from '@/types/service';
import { Input } from './get-email-template-master-service';

import { GetEmailTemplateMasterServiceApi } from './get-email-template-master-service-api';

export const makeGetEmailTemplateMasterService: ServiceMaker<Input> = () => {
  return new GetEmailTemplateMasterServiceApi();
};

export * from './get-email-template-master-service-mock';
export * from './get-email-template-master-service-api';
