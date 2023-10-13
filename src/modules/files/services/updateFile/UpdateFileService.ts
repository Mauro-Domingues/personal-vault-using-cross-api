import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { updateAttribute } from '@utils/mappers';
import { File } from '@modules/files/entities/File';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Connection } from '@shared/typeorm';
import {
  Route,
  Tags,
  Put,
  Body,
  Path,
  Consumes,
  UploadedFile,
  Header,
} from 'tsoa';
import { IStorageProviderDTO } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@Route('/files')
@injectable()
export class UpdateFileService {
  constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepositoryDTO,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProviderDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Put('{id}')
  @Tags('File')
  @Header('client-id')
  @Consumes('multipart/form-data')
  @UploadedFile('file')
  public async execute(
    @Body() fileData: IFileDTO,
    @Path() id?: string,
  ): Promise<IResponseDTO<File>> {
    const trx = Connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const file = await this.filesRepository.findBy({ where: { id } }, trx);

      if (!file) {
        throw new AppError('NOT_FOUND', 'File not found', 404);
      }

      if (fileData.file && fileData.file !== file.file) {
        if (file.file) await this.storageProvider.deleteFile(file.file);
        await this.storageProvider.saveFile(fileData.file);
      }

      await this.filesRepository.update(updateAttribute(file, fileData), trx);

      await this.cacheProvider.invalidatePrefix(`${Connection.client}:files`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'UPDATED',
        message: 'successfully updated file',
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
