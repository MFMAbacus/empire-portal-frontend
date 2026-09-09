import { Service } from '@/services/service';
import { Input } from './get-movement-type-master-service';
import { ServiceOutput } from '@/types/service';

import { MockService } from '@/utility/mock-service';

export class GetMovementTypeMasterServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log('get apatment master service', input);

    return this._mockService.execute(() => {
      return {
        success: true,
        code: 'success',
        data: [],
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
