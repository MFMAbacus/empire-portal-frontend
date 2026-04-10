import {Service} from '@/services/service';
import {Input} from './get-session-service';
import {ServiceOutput} from '@/types/service';

import {MockService} from '@/utility/mock-service';

export class GetSessionServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log('get session service', input);

    return this._mockService.execute(() => {
      return {
        success: true,
        code: 'success',
        data: {
          id: 's1',
          userId: 'u1',
          role: 'manager',
          firstName: 'Empire',
          lastName: 'World',
        },
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
