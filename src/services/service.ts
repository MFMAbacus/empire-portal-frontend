import {ServiceOutput} from '@/types/service';

export abstract class Service<Input> {
  public abstract execute(input: Input): Promise<ServiceOutput>;
  public abstract abort(): void;
}
