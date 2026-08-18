import {ServiceMaker} from '@/types/service';
import {Input} from './create-sub-task-service';

import {CreateSubTaskServiceApi} from './create-sub-task-service-api';

export const makeCreateSubTaskService: ServiceMaker<Input> = () => {
  return new CreateSubTaskServiceApi();
};

export * from './create-sub-task-service-mock';
export * from './create-sub-task-service-api';
