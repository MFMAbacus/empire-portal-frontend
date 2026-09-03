import { Service } from "@/services/service";
import { Input } from "./create-resident-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateResidentMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      residentId,
      name,
      email,
      mobileNo,
      apartmentId,
      projectCode,
      loginUserId,
      residentType,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || residentId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/resident-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/resident-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        residentId: residentId,
        name:name !== "" ? name : undefined,
        email:email !=="" ? email : undefined,
        mobileNo: mobileNo !=="" ? mobileNo : undefined,
        apartmentId:apartmentId !=="" ? apartmentId : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        loginUserId:loginUserId !=="" ? loginUserId : undefined,
        residentType:residentType !=="" ? residentType : undefined,
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