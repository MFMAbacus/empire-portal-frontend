import {ServiceMaker} from '@/types/service';
import {Input} from './assign-sub-task-service';

import {AssignSubTaskServiceApi} from './assign-sub-task-service-api';

export const makeAssignSubTaskService: ServiceMaker<Input> = () => {
  return new AssignSubTaskServiceApi();
};

export * from './assign-sub-task-service-mock';
export * from './assign-sub-task-service-api';
