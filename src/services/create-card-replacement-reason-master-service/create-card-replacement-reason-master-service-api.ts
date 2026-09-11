import { Service } from "@/services/service";
import { Input } from "./create-card-replacement-reason-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCardReplacementReasonMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      reasonId,
      reasonName,
      chargesApplicable,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || reasonId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/card-replacement-reason-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/card-replacement-reason-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        reasonId: reasonId,
        reasonName: reasonName !== "" ? reasonName : undefined,
        chargesApplicable: chargesApplicable !== "" ? chargesApplicable: undefined,
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