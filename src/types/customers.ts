export enum CustomerStatus {
  ALL,
  ACTIVATED,
  INVITATION_PENDING,
  NOT_INVITED,
  BLOCKED,
}

export type CustomerInvitationStatus =
  'not-invited' |
  'invitation-pending' |
  'activated';

export type CustomerRecord = {
  id: string;
  fullName: string;
  email: string;
  address: string;
  invitationStatus: CustomerInvitationStatus;
  isBlocked: boolean;
};
