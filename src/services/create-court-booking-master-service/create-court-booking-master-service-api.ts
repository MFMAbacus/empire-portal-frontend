import { Service } from "@/services/service";
import { Input } from "./create-court-booking-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCourtBookingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      maxBooking,
      advanceBooking,
      projectCode,
      pendingSlot,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/court-booking-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/court-booking-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        maxBooking:maxBooking !==0 ? maxBooking : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        advanceBooking:advanceBooking !==0 ? advanceBooking : undefined,
        pendingSlot,
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