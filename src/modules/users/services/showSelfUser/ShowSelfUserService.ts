import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { User } from '@modules/users/entities/User';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { Get, Route, Tags, Inject } from 'tsoa';

@Route('/me')
@injectable()
export class ShowSelfUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  @Get()
  @Tags('User')
  public async execute(
    @Inject() id?: string,
  ): Promise<IResponseDTO<Omit<User, 'password'>>> {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `users:${id}`;

      let cache = await this.cacheProvider.recovery<{ data: User }>(cacheKey);

      if (!cache) {
        const user = await this.usersRepository.findBy(
          {
            where: { id },
            select: { id: true, email: true, name: true, clientID: true },
          },
          trx,
        );

        if (!user) {
          throw new AppError('NOT_FOUND', 'User not found', 404);
        }

        cache = {
          data: instanceToInstance(user),
        };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'FOUND',
        message: 'User found successfully',
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
