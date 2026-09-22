import { ServiceMaker } from '@/types/service';
import { UpdateCardProcessingInput, UpdateCardProcessingMasterServiceApi } from './update-card-processing-master-service-api';

export const makeUpdateCardProcessingMasterService: ServiceMaker<UpdateCardProcessingInput> = () => {
  return new UpdateCardProcessingMasterServiceApi();
};

export * from './update-card-processing-master-service-api';
