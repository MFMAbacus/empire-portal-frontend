import { Service } from "@/services/service";
import { Input } from "./create-restaurant-staff-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateRestaurantStaffMasterServiceApi extends Service<Input> {
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
      role,
      venueId,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && id
      ? `${apiUrl}/restaurant-staff-master/${id}?sessionId=${sessionId}`
      : `${apiUrl}/restaurant-staff-master?sessionId=${sessionId}`;

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
        role: role !== "" ? role : undefined,
        venueId: venueId !== "" ? venueId : undefined,
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