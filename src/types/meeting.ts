import {TaskPriority} from '@/types/task';

export type MeetingInvitationStatus = 'pending' | 'accepted' | 'refused';

export type MeetingImportance = TaskPriority;

export type MeetingInvitation = {
  staffId: string;
  staffName: string;
  status: MeetingInvitationStatus;
  isRequired: boolean;
  date: string | null;
  time: string | null;
};

export type MeetingInvitationRequest = {
  staffId: string;
  isRequired: boolean,
};

export type Meeting = {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  importance: MeetingImportance;
  agenda: string;
  invitation: MeetingInvitation[];
  isArchived: boolean;
};
