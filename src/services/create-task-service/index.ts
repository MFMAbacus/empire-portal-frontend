import {ServiceMaker} from '@/types/service';
import {Input} from './create-task-service';

import {CreateTaskServiceApi} from './create-task-service-api';

export const makeCreateTaskService: ServiceMaker<Input> = () => {
  return new CreateTaskServiceApi();
};

export * from './create-task-service-mock';
export * from './create-task-service-api';
