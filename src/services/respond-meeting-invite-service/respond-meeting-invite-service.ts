import {MeetingInvitationStatus} from '@/types/meeting';

export type Input = {
  sessionId: string;
  meetingId: string;
  status: MeetingInvitationStatus;
  remarks?: string;
};