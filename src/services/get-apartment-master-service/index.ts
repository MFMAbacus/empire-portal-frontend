import { ServiceMaker } from '@/types/service';
import { Input } from './get-apartment-master-service';

import { GetApartmentMasterServiceApi } from './get-apartment-master-service-api';

export const makeGetApartmentMasterService: ServiceMaker<Input> = () => {
  return new GetApartmentMasterServiceApi();
};

export * from './get-apartment-master-service-mock';
export * from './get-apartment-master-service-api';
