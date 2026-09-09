import { ServiceMaker } from '@/types/service';
import { Input } from './delete-qr-configuration-master-service';

import { DeleteQRConfigurationMasterServiceApi } from './delete-qr-configuration-master-service-api';

export const makeDeleteQRConfigurationMasterService: ServiceMaker<Input> = () => {
  return new DeleteQRConfigurationMasterServiceApi();
};

export * from './delete-qr-configuration-master-service-api';
export * from './delete-qr-configuration-master-service-mock';