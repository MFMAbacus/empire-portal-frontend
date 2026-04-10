import {ServiceMaker} from '@/types/service';
import {Input} from './assign-request-service';

import {AssignRequestServiceApi} from './assign-request-service-api';

export const makeAssignRequestService: ServiceMaker<Input> = () => {
  return new AssignRequestServiceApi();
};

export * from './assign-request-service-mock';
export * from './assign-request-service-api';
