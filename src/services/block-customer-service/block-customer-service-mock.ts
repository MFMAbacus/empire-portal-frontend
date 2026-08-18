import { Service } from "@/services/service";
import { Input } from "./block-customer-service";
import { ServiceOutput } from "@/types/service";

import { MockService } from "@/utility/mock-service";

export class BlockCustomerServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log("block customer service", input);
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
