import { Service } from "@/services/service";
import { Input } from "./create-item-type-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateItemTypeMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      itemTypeId,
      itemTypeName,
      description,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || itemTypeId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/item-type-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/item-type-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        itemTypeId: itemTypeId,
        itemTypeName: itemTypeName !== "" ? itemTypeName : undefined,
        description: description !== "" ? description: undefined,
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