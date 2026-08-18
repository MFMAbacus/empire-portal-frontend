import { Service } from "@/services/service";
import { Input } from "./update-welcomescreen-media-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class UpdateWelcomescreenMediaServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, mediaId, title, isActive, fileName } = input;

    const response = await fetch(`${apiUrl}/welcomescreen-media/${mediaId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        sessionId,
        title,
        fileName,
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
