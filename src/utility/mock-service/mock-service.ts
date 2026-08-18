import {ServiceOutput} from '@/types/service';

type MockServiceProps = {
  delay?: number;
};

export class MockService {
  protected _timeout: NodeJS.Timeout | null;
  protected _delay: number;

  public constructor(props: MockServiceProps = {}) {
    const {
      delay = defaultDelay,
    } = props;

    this._timeout = null;
    this._delay = delay;
  }

  public async execute(callback: () => ServiceOutput): Promise<ServiceOutput> {
    return new Promise((resolve, reject) => {
      this._timeout = setTimeout(() => {
        try {
          resolve(callback());
        } catch (error: unknown) {
          reject(error);
        }
      }, this._delay);
    });
  }

  public abort(): void {
    if (this._timeout === null) {
      return;
    }
    clearTimeout(this._timeout);
    this._timeout = null;
  }
}

const defaultDelay = 1000;
