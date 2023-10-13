import { injectable, inject } from 'tsyringe';

import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { File } from '@modules/files/entities/File';
import { instanceToInstance } from 'class-transformer';
import { ICacheDTO } from '@dtos/ICacheDTO';
import { IListDTO } from '@dtos/IListDTO';
import { Connection } from '@shared/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Get, Route, Tags, Query, Inject, Header } from 'tsoa';

@Route('/files')
@injectable()
export class ListFileService {
  constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepositoryDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Get()
  @Header('client-id')
  @Tags('File')
  public async execute(
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: FindOptionsWhere<File>,
  ): Promise<IListDTO<File>> {
    const trx = Connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        Connection.client
      }:files:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<ICacheDTO<File>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.filesRepository.findAll(
          { where: filters, page, limit, select: { id: true, file: true } },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'LISTED',
        message: 'Files found successfully',
        pagination: {
          total: cache.total,
          page,
          perPage: limit,
          lastPage: Math.ceil(cache.total / limit),
        },
        data: cache.data,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
