import {ServiceMaker} from '@/types/service';
import {Input} from './delete-request-service';

import {DeleteRequestServiceApi} from './delete-request-service-api';

export const makeDeleteRequestService: ServiceMaker<Input> = () => {
  return new DeleteRequestServiceApi();
};

export * from './delete-request-service-mock';
export * from './delete-request-service-api';
