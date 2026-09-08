import { Service } from "@/services/service";
import { Input } from "./create-gate-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateGateMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      gateId,
      gateName,
      location,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || gateId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/gate-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/gate-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        gateId: gateId,
        gateName:gateName !== "" ? gateName : undefined,
        location:location !=="" ? location : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
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