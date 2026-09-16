import { Service } from "@/services/service";
import { Input } from "./create-court-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCourtMasterServiceApi extends Service<Input> {
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
      courtName,
      courtType,
      location,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || courtId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/court-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/court-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        courtId: courtId,
        projectCode: projectCode !== "" ? projectCode : undefined,
        courtName: courtName !== "" ? courtName : undefined,
        courtType: courtType !== "" ? courtType : undefined,
        location: location !== "" ? location : undefined,
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