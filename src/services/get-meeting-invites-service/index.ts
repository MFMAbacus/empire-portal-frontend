import { ServiceMaker } from "@/types/service";
import { Input } from "./get-meeting-invites-service";

import { GetMeetingInvitesServiceApi } from "./get-meeting-invites-service-api";

export const makeGetMeetingInvitesService: ServiceMaker<Input> = () => {
  return new GetMeetingInvitesServiceApi();
};

export * from "./get-meeting-invites-service-mock";
export * from "./get-meeting-invites-service-api";
