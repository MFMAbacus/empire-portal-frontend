import { ServiceMaker } from '@/types/service';
import { Input } from './get-qr-configuration-master-service';

import { GetQRConfigurationMasterServiceApi } from './get-qr-configuration-master-service-api';

export const makeGetQRConfigurationMasterService: ServiceMaker<Input> = () => {
  return new GetQRConfigurationMasterServiceApi();
};

export * from './get-qr-configuration-master-service-mock';
export * from './get-qr-configuration-master-service-api';
