import { Service } from "@/services/service";
import { Input } from "./create-welcomescreen-media-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateWelcomescreenMediaServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, title, fileName, isActive } = input;

    const response = await fetch(`${apiUrl}/welcomescreen-media`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      mode: "cors",
      body: JSON.stringify({
        sessionId,
        title,
        fileName,
        isActive,
      }),
      signal: this._abortController.signal,
    });
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
