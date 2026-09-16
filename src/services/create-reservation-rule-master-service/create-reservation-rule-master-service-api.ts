import { Service } from "@/services/service";
import { Input } from "./create-reservation-rule-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateReservationRuleMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      slotDuration,
      maxGuest,
      lateArrival,
      venueId,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/reservation-rule-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/reservation-rule-master?sessionId=${sessionId}`;

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
        slotDuration: slotDuration !== 0 ? slotDuration : undefined,
        maxGuest: maxGuest !== 0 ? maxGuest : undefined,
        lateArrival: lateArrival !== 0 ? lateArrival : undefined,
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