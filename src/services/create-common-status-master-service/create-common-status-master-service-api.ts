import { Service } from "@/services/service";
import { Input } from "./create-common-status-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateCommonStatusMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      statusCode,
      module,
      statusName,
      sequence,
      isActive,
      isEdit,
    } = input as any;

    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && id
      ? `${apiUrl}/common-status-master/${id}?sessionId=${sessionId}`
      : `${apiUrl}/common-status-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        statusCode: statusCode !== "" ? statusCode : undefined,
        module: module !== "" ? module : undefined,
        statusName: statusName !== "" ? statusName : undefined,
        sequence: sequence !== 0 ? sequence : undefined,
        isActive,
      }),
      mode: "cors",
      signal: this._abortController.signal,
    });

    const responseData = await response.json();
    return responseData;
  }

  public abort(): void {
    this._abortController.abort();
  }
}