import { Service } from "@/services/service";
import { Input } from "./create-user-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateUserMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      userId,
      name,
      role,
      assignedModule,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || userId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/user-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/user-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        userId: userId,
        name:name !== "" ? name : undefined,
        role:role !=="" ? role : undefined,
        assignedModule:assignedModule !=="" ? assignedModule : undefined,
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