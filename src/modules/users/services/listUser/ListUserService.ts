import { injectable, inject } from 'tsyringe';

import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { User } from '@modules/users/entities/User';
import { instanceToInstance } from 'class-transformer';
import { ICacheDTO } from '@dtos/ICacheDTO';
import { IListDTO } from '@dtos/IListDTO';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { FindOptionsWhere } from 'typeorm';
import { Get, Route, Tags, Query, Inject } from 'tsoa';

@Route('/users')
@injectable()
export class ListUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Get()
  @Tags('User')
  public async execute(
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: FindOptionsWhere<User>,
  ): Promise<IListDTO<User>> {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `users:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<ICacheDTO<User>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.usersRepository.findAll(
          { where: filters, page, limit, select: { id: true, name: true } },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'LISTED',
        message: 'Users found successfully',
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
