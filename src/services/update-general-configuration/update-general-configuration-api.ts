import { Service } from "../service";
import { ServiceOutput } from "@/types/service";
import { Input } from "./update-general-configuration";
import { apiUrl } from "@/config";

export class UpdateGeneralConfigurationServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }
  public async execute(input: Input): Promise<ServiceOutput> {
    const response = await fetch(
      `${apiUrl}/general-configurations/${input.configKey}?sessionId=${input.sessionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${input.sessionId}`,
        },
        body: JSON.stringify(input.updates),
        signal: this._abortController.signal,
      }
    );
    const body = await response.json();
    return body;
  }

  public abort(): void {
    if (this._abortController) {
      this._abortController.abort();
    }
  }
}
