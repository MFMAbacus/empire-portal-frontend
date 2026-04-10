import {ServiceMaker} from '@/types/service';
import {Input} from './delete-announcements-service';

import {DeleteAnnouncementServiceApi} from './delete-announcement-service-api';

export const makeDeleteAnnouncementService: ServiceMaker<Input> = () => {
  return new DeleteAnnouncementServiceApi();
};

export * from './delete-announcement-service-mock';
export * from './delete-announcement-service-api';
