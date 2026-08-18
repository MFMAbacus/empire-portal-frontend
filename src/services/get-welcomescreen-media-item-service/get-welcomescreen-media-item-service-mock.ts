import { Service } from "@/services/service";
import { Input } from "./get-welcomescreen-media-item-service";
import { ServiceOutput } from "@/types/service";

export class GetWelcomescreenMediaItemServiceMock extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: input.mediaId,
            title: "Sample Media",
            fileName: "sample.jpg",
            filePath: "storage/uploads/sample.jpg",
            fileType: "image",
            fileSize: 1024,
            mimeType: "image/jpeg",
            isActive: true,
            displayOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          code: "",
        });
      }, 1000);
    });
  }

  public abort(): void {
    this._abortController.abort();
  }
}
