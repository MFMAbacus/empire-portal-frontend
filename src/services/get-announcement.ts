import {AnnouncementRecord} from '@/types/announcements';

import {announcements} from '@/data/announcements';

export const getAnnouncement = (id: string): AnnouncementRecord | undefined => {
  return announcements.records.find((current) => {
    return current.id === id;
  });
};
