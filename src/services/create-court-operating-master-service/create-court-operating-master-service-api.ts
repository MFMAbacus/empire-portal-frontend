import { Service } from "@/services/service";
import { Input } from "./create-court-operating-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCourtOperatingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      courtId,
      day,
      openTime,
      closeTime,
      isClosed,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/court-operating-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/court-operating-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        courtId:courtId !=="" ? courtId : undefined,
        day: day !=="" ? day :undefined,
        openTime :openTime !== ""? openTime : undefined,
        closeTime : closeTime !== "" ? closeTime:undefined,
        isClosed,
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