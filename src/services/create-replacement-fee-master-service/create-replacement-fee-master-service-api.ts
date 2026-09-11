import { Service } from "@/services/service";
import { Input } from "./create-replacement-fee-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateReplacementFeeMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      feeId,
      feeAmount,
      tax,
      currency,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || feeId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/replacement-fee-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/replacement-fee-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        feeId: feeId,
        projectCode: projectCode !== "" ? projectCode : undefined,
        feeAmount: feeAmount !== "" ? feeAmount : undefined,
        tax: tax !== "" ? tax : undefined,
        currency: currency !== "" ? currency : undefined,
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