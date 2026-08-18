import {ServiceMaker} from '@/types/service';
import {Input} from './get-tasks-service';

import {GetTasksServiceApi} from './get-tasks-service-api';

export const makeGetTasksService: ServiceMaker<Input> = () => {
  return new GetTasksServiceApi();
};

export * from './get-tasks-service-mock';
export * from './get-tasks-service-api';
