import { ServiceMaker } from '@/types/service';
import { GetRequestHistoryInput, GetRequestHistoryMasterServiceApi } from './get-request-history-master-service-api';

export const makeGetRequestHistoryMasterService: ServiceMaker<GetRequestHistoryInput> = () => {
  return new GetRequestHistoryMasterServiceApi();
};

export * from './get-request-history-master-service-api';
