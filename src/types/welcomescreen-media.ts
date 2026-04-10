export interface WelcomescreenMedia {
  _id: string;
  title: string;
  fileName: string;
  filePath: string;
  fileType: "image" | "gif";
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWelcomescreenMediaRequest {
  title: string;
  fileName: string;
}

export interface UpdateWelcomescreenMediaRequest {
  _id: string;
  title?: string;
  fileBuffer?: Buffer;
  originalFileName?: string;
  mimeType?: string;
}
