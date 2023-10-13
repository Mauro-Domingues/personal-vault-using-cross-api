export interface IStorageProviderDTO {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
