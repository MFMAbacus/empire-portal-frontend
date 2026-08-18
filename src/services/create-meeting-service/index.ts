import {ServiceMaker} from '@/types/service';
import {Input} from './create-meeting-service';

import {CreateMeetingServiceApi} from './create-meeting-service-api';

export const makeCreateMeetingService: ServiceMaker<Input> = () => {
  return new CreateMeetingServiceApi();
};

export * from './create-meeting-service-mock';
export * from './create-meeting-service-api';
