import { ServiceMaker } from '@/types/service';
import { GetCardProcessingInput, GetCardProcessingMasterServiceApi } from './get-card-processing-master-service-api';

export const makeGetCardProcessingMasterService: ServiceMaker<GetCardProcessingInput> = () => {
  return new GetCardProcessingMasterServiceApi();
};

export * from './get-card-processing-master-service-api';
