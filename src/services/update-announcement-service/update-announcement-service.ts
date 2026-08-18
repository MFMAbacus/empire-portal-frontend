import {AnnouncementGroup} from '@/types/announcement';

export type Input = {
  sessionId: string;
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
};
