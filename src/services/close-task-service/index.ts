import {ServiceMaker} from '@/types/service';
import {Input} from './close-task-service';

import {CloseTaskServiceApi} from './close-task-service-api';

export const makeCloseTaskService: ServiceMaker<Input> = () => {
  return new CloseTaskServiceApi();
};

export * from './close-task-service-mock';
export * from './close-task-service-api';
