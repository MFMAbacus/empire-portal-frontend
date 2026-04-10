import { RespondMeetingInviteServiceApi } from "./respond-meeting-invite-service-api";
import { RespondMeetingInviteServiceMock } from "./respond-meeting-invite-service-mock";

export const makeRespondMeetingInviteService = () => {
  return new RespondMeetingInviteServiceApi();
};
