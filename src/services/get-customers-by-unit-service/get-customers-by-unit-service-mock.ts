import { Service } from "@/services/service";
import { Input } from "./get-customers-by-unit-service";
import { ServiceOutput } from "@/types/service";

export class GetCustomersByUnitServiceMock extends Service<Input> {
  public constructor() {
    super();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    return {
      code: "success",
      success: true,
      data: [],
    };
  }

  public abort(): void {}
}
