import { Service } from "@/services/service";
import { Input } from "./create-email-template-master-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateEmailTemplateMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      templateCode,
      module,
      event,
      subject,
      body: templateBody,
      isActive,
      isEdit,
    } = input as any;

    const isUpdating = Boolean(isEdit || id);
    const url = isUpdating && id
      ? `${apiUrl}/email-template-master/${id}?sessionId=${sessionId}`
      : `${apiUrl}/email-template-master?sessionId=${sessionId}`;

    const method = isUpdating ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: isUpdating ? id : undefined,
        templateCode: templateCode !== "" ? templateCode : undefined,
        module: module !== "" ? module : undefined,
        event: event !== "" ? event : undefined,
        subject: subject !== "" ? subject : undefined,
        body: templateBody !== "" ? templateBody : undefined,
        isActive,
      }),
      mode: "cors",
      signal: this._abortController.signal,
    });

    const responseData = await response.json();
    return responseData;
  }

  public abort(): void {
    this._abortController.abort();
  }
}