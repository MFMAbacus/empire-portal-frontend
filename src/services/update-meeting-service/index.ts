import {ServiceMaker} from '@/types/service';
import {Input} from './update-meeting-service';

import {UpdateMeetingServiceApi} from './update-meeting-service-api';

export const makeUpdateMeetingService: ServiceMaker<Input> = () => {
  return new UpdateMeetingServiceApi();
};

export * from './update-meeting-service-mock';
export * from './update-meeting-service-api';
