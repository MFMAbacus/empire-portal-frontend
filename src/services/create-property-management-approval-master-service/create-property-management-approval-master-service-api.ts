import { Service } from "@/services/service";
import { Input } from "./create-property-management-approval-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreatePropertyManagementApprovalMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      approverRole,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && id
      ? `${apiUrl}/property-management-approval-master/${id}?sessionId=${sessionId}`
      : `${apiUrl}/property-management-approval-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        approverRole: approverRole !== "" ? approverRole : undefined,
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