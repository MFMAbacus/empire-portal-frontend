import { Service } from "@/services/service";
import { Input } from "./create-guard-account-mapping-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateGuardAccountMappingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      guardAccountId,
      guardUserId,
      gateId,
      projectCode,
      deviceId,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || guardAccountId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/guard-account-mapping-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/guard-account-mapping-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        guardAccountId: guardAccountId,
        guardUserId:guardUserId !== "" ? guardUserId : undefined,
        gateId:gateId !=="" ? gateId : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        deviceId:deviceId !=="" ? deviceId : undefined,
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