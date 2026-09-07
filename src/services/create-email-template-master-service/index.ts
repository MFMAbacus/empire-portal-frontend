import { ServiceMaker } from '@/types/service';
import { Input } from './create-email-template-master-service';

import { CreateEmailTemplateMasterServiceApi } from './create-email-template-master-service-api';

export const makeCreateEmailTemplateMasterService: ServiceMaker<Input> = () => {
  return new CreateEmailTemplateMasterServiceApi();
};

export * from './create-email-template-master-service-mock';
export * from './create-email-template-master-service-api';