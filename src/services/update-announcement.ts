import {AnnouncementRecord} from '@/types/announcements';

import {announcements} from '@/data/announcements';

type UpdateAnnouncementArgs = {
  announcementId: string;
  announcement: AnnouncementRecord;
};

export const updateAnnouncement = ({
  announcementId,
  announcement,
}: UpdateAnnouncementArgs) => {
  announcements.records = announcements.records.map((current) => {
    if (current.id !== announcementId) {
      return current;
    }
    return announcement;
  });
};
