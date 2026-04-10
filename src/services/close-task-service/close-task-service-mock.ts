import { Service } from "@/services/service";
import { Input } from "./close-task-service";
import { ServiceOutput } from "@/types/service";

import { MockService } from "@/utility/mock-service";

export class CloseTaskServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log("close task service", input);

    return this._mockService.execute(() => {
      return {
        success: true,
        code: "success",
        data: undefined,
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
