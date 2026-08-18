import {ServiceMaker} from '@/types/service';
import {Input} from './delete-task-service';

import {DeleteTaskServiceApi} from './delete-task-service-api';

export const makeDeleteTaskService: ServiceMaker<Input> = () => {
  return new DeleteTaskServiceApi();
};

export * from './delete-task-service-mock';
export * from './delete-task-service-api';
