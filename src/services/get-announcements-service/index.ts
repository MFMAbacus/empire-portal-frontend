import {ServiceMaker} from '@/types/service';
import {Input} from './get-announcements-service';

import {GetAnnouncementsServiceApi} from './get-announcements-service-api';

export const makeGetAnnouncementsService: ServiceMaker<Input> = () => {
  return new GetAnnouncementsServiceApi();
};

export * from './get-announcements-service-mock';
export * from './get-announcements-service-api';
