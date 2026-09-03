import { Service } from "@/services/service";
import { Input } from "./create-apartment-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateApartmentMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      apartmentId,
      apartmentNo,
      buildingOrTower,
      floor,
      projectCode,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || apartmentId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/apartment-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/apartment-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        apartmentId: apartmentId,
        projectCode: projectCode !== "" ? projectCode : undefined,
        apartmentNo: apartmentNo !== "" ? apartmentNo : undefined,
        buildingOrTower: buildingOrTower !== "" ? buildingOrTower : undefined,
        floor: floor !== "" ? floor : undefined,
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