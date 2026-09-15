import { ServiceMaker } from '@/types/service';
import { Input } from './delete-venue-operating-master-service';

import { DeleteVenueOperatingMasterServiceApi } from './delete-venue-operating-master-service-api';

export const makeDeleteVenueOperatingMasterService: ServiceMaker<Input> = () => {
  return new DeleteVenueOperatingMasterServiceApi();
};

export * from './delete-venue-operating-master-service-mock';
export * from './delete-venue-operating-master-service-api';
