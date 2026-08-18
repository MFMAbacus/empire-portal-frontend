import {AnnouncementRecord} from '@/types/announcements';

import {announcements} from '@/data/announcements';

export const createAnnouncement = (announcement: AnnouncementRecord) => {
  return announcements.records.push(announcement);
};
