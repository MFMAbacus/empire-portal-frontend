import {AnnouncementRecord} from '@/types/announcements';

import {announcements} from '@/data/announcements';

export const getAnnouncements = (id?: string): AnnouncementRecord[] => {
  return announcements.records.filter((current) => {
    if (id) {
      return current.id.match(id);
    }
    return true;
  });
};
