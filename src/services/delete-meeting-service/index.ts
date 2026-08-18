import {ServiceMaker} from '@/types/service';
import {Input} from './delete-meeting-service';

import {DeleteMeetingServiceApi} from './delete-meeting-service-api';

export const makeDeleteMeetingService: ServiceMaker<Input> = () => {
  return new DeleteMeetingServiceApi();
};

export * from './delete-meeting-service-mock';
export * from './delete-meeting-service-api';
