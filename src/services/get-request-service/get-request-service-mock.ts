import {Service} from '@/services/service';
import {Input} from './get-request-service';
import {ServiceOutput} from '@/types/service';

import {MockService} from '@/utility/mock-service';

export class GetRequestServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log('get request service', input);

    return this._mockService.execute(() => {
      return {
        success: false,
        code: 'not-found',
        data: undefined,
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
