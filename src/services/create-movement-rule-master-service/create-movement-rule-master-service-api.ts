import { Service } from "@/services/service";
import { Input } from "./create-movement-rule-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateMovementRuleMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      projectCode,
      startTime,
      endTime,
      blockedDays,
      isActive,
    } = input;

    const isUpdating = Boolean(id);

    // API URL updated to movement-rule-master
    const url = isUpdating && id
      ? `${apiUrl}/movement-rule-master/${id}?sessionId=${sessionId}`
      : `${apiUrl}/movement-rule-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        projectCode: projectCode !== "" ? projectCode : undefined,
        startTime: startTime !== "" ? startTime : undefined,
        endTime: endTime !== "" ? endTime : undefined,
        blockedDays: blockedDays !== "" ? blockedDays : undefined,
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

export const makeCreateMovementRuleMasterService = () => {
  return new CreateMovementRuleMasterServiceApi();
};