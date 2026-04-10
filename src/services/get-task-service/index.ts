import {ServiceMaker} from '@/types/service';
import {Input} from './get-task-service';

import {GetTaskServiceApi} from './get-task-service-api';

export const makeGetTaskService: ServiceMaker<Input> = () => {
  return new GetTaskServiceApi();
};

export * from './get-task-service-mock';
export * from './get-task-service-api';
