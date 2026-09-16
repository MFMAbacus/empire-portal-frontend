import { Service } from "@/services/service";
import { Input } from "./create-menu-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateMenuMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      menuId,
      menuName,
      price,
      menuItem,
      venueId,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || menuId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/menu-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/menu-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        menuId: menuId,
        venueId: venueId !== "" ? venueId : undefined,
        menuName: menuName !== "" ? menuName : undefined,
        price: price !== 0 ? price : undefined,
        menuItem: menuItem !== "" ? menuItem : undefined,
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