import {Service} from '@/services/service';
import {Input} from './get-announcement-service';
import {ServiceOutput} from '@/types/service';

import {MockService} from '@/utility/mock-service';

export class GetAnnouncementServiceMock extends Service<Input> {
  protected _mockService: MockService;

  public constructor() {
    super();
    this._mockService = new MockService();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    console.log('get announcement service', input);

    return this._mockService.execute(() => {
      return {
        success: true,
        code: 'success',
        data: {
          id: 'A-000001',
          title: 'Title 1',
          description: 'Description 1',
          publishDate: '2023-07-07',
          expirationDate: '2023-07-07',
          isPublished: true,
        },
      };
    });
  }

  public abort(): void {
    this._mockService.abort();
  }
}
