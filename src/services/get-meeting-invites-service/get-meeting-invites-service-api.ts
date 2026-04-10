import { Service } from "@/services/service";
import { Input } from "./get-meeting-invites-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class GetMeetingInvitesServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived } = input;

    const response = await fetch(
      `${apiUrl}/meetings/invites?sessionId=${sessionId}&isArchived=${
        isArchived ? "1" : ""
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        mode: "cors",
        signal: this._abortController.signal,
      }
    );
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
