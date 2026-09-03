import { ServiceMaker } from '@/types/service';
import { Input } from './delete-apartment-master-service';

import { DeleteApartmentMasterServiceApi } from './delete-apartment-master-service-api';

export const makeDeleteApartmentMasterService: ServiceMaker<Input> = () => {
  return new DeleteApartmentMasterServiceApi();
};

export * from './delete-apartment-master-service-mock';
export * from './delete-apartment-master-service-api';
