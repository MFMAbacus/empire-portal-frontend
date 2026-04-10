import {announcements} from '@/data/announcements';

type ArchiveActivity = {
  announcementId: string;
};

export const archiveAnnouncement = ({
  announcementId,
}: ArchiveActivity) => {
  announcements.records = announcements.records.filter((current) => {
    return current.id !== announcementId;
  });
};
