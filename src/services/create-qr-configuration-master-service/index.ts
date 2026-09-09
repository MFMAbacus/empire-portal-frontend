import { ServiceMaker } from '@/types/service';
import { Input } from './create-qr-configuration-master-service';

import { CreateQRConfigurationMasterServiceApi } from './create-qr-configuration-master-service-api';

export const makeCreateQRConfigurationMasterService: ServiceMaker<Input> = () => {
  return new CreateQRConfigurationMasterServiceApi();
};

export * from './create-qr-configuration-master-service-mock';
export * from './create-qr-configuration-master-service-api';