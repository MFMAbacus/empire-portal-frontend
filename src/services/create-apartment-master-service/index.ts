import { ServiceMaker } from '@/types/service';
import { Input } from './create-apartment-master-service';

import { CreateApartmentMasterServiceApi } from './create-apartment-master-service-api';

export const makeCreateApartmentMasterService: ServiceMaker<Input> = () => {
  return new CreateApartmentMasterServiceApi();
};

export * from './create-apartment-master-service-mock';
export * from './create-apartment-master-service-api';