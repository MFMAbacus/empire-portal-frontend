import { Service } from "@/services/service";
import { Input } from "./get-general-configuration-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class GetGeneralConfigurationServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, configKey } = input;

    const response = await fetch(
      `${apiUrl}/general-configurations/${configKey}?sessionId=${sessionId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        mode: "cors",
        signal: this._abortController.signal,
      }
    );
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
