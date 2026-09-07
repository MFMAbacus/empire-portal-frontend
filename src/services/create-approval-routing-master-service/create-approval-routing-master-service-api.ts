import { Service } from "@/services/service";
import { Input } from "./create-approval-routing-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateApprovalRoutingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      routingId,
      module,
      projectCode,
      approverRole,
      approvalLevel,
      status,
      isActive,
      isEdit,
    } = input as any;

    const isUpdating = Boolean(isEdit || routingId);
    
    // API URL updated to approval-routing-master using routingId
    const url = isUpdating && routingId
      ? `${apiUrl}/approval-routing-master/${routingId}?sessionId=${sessionId}`
      : `${apiUrl}/approval-routing-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        routingId: routingId !== "" ? routingId : undefined,
        module: module !== "" ? module : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        approverRole: approverRole !== "" ? approverRole : undefined,
        approvalLevel: approvalLevel !== "" ? approvalLevel : undefined,
        status: status !== "" ? status : undefined,
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