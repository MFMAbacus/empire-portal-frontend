import {ServiceMaker} from '@/types/service';
import {Input} from './assign-task-service';

import {AssignTaskServiceApi} from './assign-task-service-api';

export const makeAssignTaskService: ServiceMaker<Input> = () => {
  return new AssignTaskServiceApi();
};

export * from './assign-task-service-mock';
export * from './assign-task-service-api';
