import { Service } from "@/services/service";
import { Input } from "./create-court-blocking-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCourtBlockingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      blockId,
      blockDate,
      startTime,
      endTime,
      courtId,
      reason,
      createdBy,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || blockId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/court-blocking-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/court-blocking-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        blockId: blockId,
        courtId: courtId !== "" ? courtId : undefined,
        blockDate: blockDate !== "" ? blockDate : undefined,
        startTime: startTime !== "" ? startTime : undefined,
        endTime: endTime !== "" ? endTime : undefined,
        reason: reason !== "" ? reason : undefined,
        createdBy: createdBy !== "" ? createdBy : undefined,
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