import { Service } from "@/services/service";
import { Input } from "./create-venue-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateVenueMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      venueId,
      venueName,
      type,
      projectCode,
      location,
      contact,
      description,
      imageOrLogo,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || venueId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/venue-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/venue-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        venueId: venueId !== "" ? venueId : undefined,
        venueName: venueName !== "" ? venueName : undefined,
        type: type !== "" ? type : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        location: location !== "" ? location : undefined,
        contact: contact !== "" ? contact : undefined,
        description: description !== "" ? description : undefined,
        imageOrLogo: imageOrLogo || undefined,
        isActive,
      }),
      mode: "cors",
      signal: this._abortController.signal,
    });

    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}