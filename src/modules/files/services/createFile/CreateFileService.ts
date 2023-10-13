import { injectable, inject } from 'tsyringe';

import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { File } from '@modules/files/entities/File';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Connection } from '@shared/typeorm';
import { Route, Tags, Post, Body, Consumes, UploadedFile, Header } from 'tsoa';
import { IStorageProviderDTO } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@Route('/files')
@injectable()
export class CreateFileService {
  constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepositoryDTO,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProviderDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Post()
  @Tags('File')
  @Header('client-id')
  @Consumes('multipart/form-data')
  @UploadedFile('file')
  public async execute(
    @Body() fileData: IFileDTO,
  ): Promise<IResponseDTO<File>> {
    const trx = Connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const file = await this.filesRepository.create(fileData, trx);

      if (fileData.file) {
        await this.storageProvider.saveFile(fileData.file);
      }

      await this.cacheProvider.invalidatePrefix(`${Connection.client}:files`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'File successfully created',
        data: instanceToInstance(file),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
