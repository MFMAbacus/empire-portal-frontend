import {MeetingImportance} from '@/types/meeting';

export type Input = {
  sessionId: string;
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  importance: MeetingImportance;
  agenda: string;
  invitation: {
    staffId: string;
    isRequired: boolean;
  }[];
};
