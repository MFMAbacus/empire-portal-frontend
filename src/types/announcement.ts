export type AnnouncementGroup = 'customers' | 'staff' | 'customers-staff';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  expirationDate: string | null;
  isPublished: boolean;
  group: AnnouncementGroup;
  pts: string[];
  pss: string[];
  bps: string[];
  prs: string[];
  bls: string[];
  fls: string[];
  uns: string[];
  attachments: string[];
  isArchived: boolean;
};
