import { Service } from "@/services/service";
import { Input } from "./create-access-card-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateAccessCardMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      cardId,
      serialNo,
      maskedSerial,
      projectCode,
      apartmentId,
      residentId,
      cardStatus,
      issueDate,
      isActive,
      isEdit,
    } = input as any;

    const targetId = id || cardId;
    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && targetId
      ? `${apiUrl}/access-card-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/access-card-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        cardId: cardId !== "" ? cardId : undefined,
        serialNo: serialNo !== "" ? serialNo : undefined,
        maskedSerial: maskedSerial !== "" ? maskedSerial : undefined,
        projectCode: projectCode !== "" ? projectCode : undefined,
        apartmentId: apartmentId !== "" ? apartmentId : undefined,
        residentId: residentId !== "" ? residentId : undefined,
        cardStatus: cardStatus !== "" ? cardStatus : undefined,
        issueDate: issueDate !== "" ? issueDate : undefined,
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