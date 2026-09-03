import { Service } from "@/services/service";
import { Input } from "./create-property-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreatePropertyMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      propertyId,
      id,
      projectCode,
      projectName,
      propertyName,
      isActive,
    } = input as any;

    const targetId = propertyId || id;
    const url = targetId
      ? `${apiUrl}/property-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/property-master?sessionId=${sessionId}`;

    const method = targetId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: targetId,
        propertyId: targetId,
        projectCode: projectCode !== "" ? projectCode : undefined,
        projectName: projectName !== "" ? projectName : undefined,
        propertyName: propertyName !== "" ? propertyName : undefined,
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