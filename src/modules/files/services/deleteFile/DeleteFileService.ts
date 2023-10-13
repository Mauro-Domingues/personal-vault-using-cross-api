import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Connection } from '@shared/typeorm';
import { Route, Tags, Delete, Path, Header } from 'tsoa';
import { IStorageProviderDTO } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@Route('/files')
@injectable()
export class DeleteFileService {
  constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepositoryDTO,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProviderDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Delete('{id}')
  @Header('client-id')
  @Tags('File')
  public async execute(@Path() id?: string): Promise<IResponseDTO<null>> {
    const trx = Connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const file = await this.filesRepository.findBy(
        { where: { id }, select: { file: true } },
        trx,
      );

      if (!file) {
        throw new AppError('NOT_FOUND', 'File not found', 404);
      }

      if (file.file) {
        await this.storageProvider.deleteFile(file.file);
      }

      await this.filesRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(`${Connection.client}:files`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        message_code: 'DELETED',
        message: 'successfully deleted file',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
