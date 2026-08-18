import { Service } from "@/services/service";
import { Input } from "./update-welcomescreen-media-service";
import { ServiceOutput } from "@/types/service";

export class UpdateWelcomescreenMediaServiceMock extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { id: input.mediaId },
          code: "",
        });
      }, 1000);
    });
  }

  public abort(): void {
    this._abortController.abort();
  }
}
