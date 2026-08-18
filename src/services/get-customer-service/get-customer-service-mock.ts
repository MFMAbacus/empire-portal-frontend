import {Service} from '@/services/service';
import {Input} from './get-customer-service';
import {ServiceOutput} from '@/types/service';

import {MockService} from '@/utility/mock-service';

export class GetCustomerServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log('get customer service', input);

    return this._mockService.execute(() => {
      return {
        success: true,
        code: 'success',
        data: {
          id: 'C-000001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@falcon.com',
          phoneNumber: '0666666666',
          dateOfBirth: '1990-09-06',
          password: 'xxxxxxxxxxxxxxxx',
          isInvited: true,
          isActive: true,
          isBlocked: false,
        },
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
