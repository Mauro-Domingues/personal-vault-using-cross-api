import { injectable, inject } from 'tsyringe';

import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { User } from '@modules/users/entities/User';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { Route, Tags, Post, Body } from 'tsoa';
import { AppError } from '@shared/errors/AppError';
import { createHash } from 'crypto';
import { IHashProviderDTO } from '@shared/container/providers/HashProvider/models/IHashProvider';

@Route('/users')
@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('HashProvider')
    private readonly hashProvider: IHashProviderDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  private async createDatabase(clientID: string): Promise<unknown> {
    return MysqlDataSource(process.env.MYSQL_DATABASE)
      .query(`CREATE DATABASE ${clientID}`)
      .catch((error: unknown) => {
        throw error;
      });
  }

  @Post()
  @Tags('User')
  public async execute(
    @Body() userData: IUserDTO,
  ): Promise<IResponseDTO<User>> {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      const checkByEmail = await this.usersRepository.exists(
        {
          where: { email: userData.email },
        },
        trx,
      );

      if (checkByEmail) {
        throw new AppError(
          'EMAIL_ALREADY_EXISTS',
          'Email address already in use',
        );
      }

      const password = await this.hashProvider.generateHash(userData.password);

      const clientID = createHash('sha256')
        .update(userData.email)
        .digest('hex');

      await this.createDatabase(clientID);

      const user = await this.usersRepository.create(
        { ...userData, password, clientID },
        trx,
      );

      await this.cacheProvider.invalidatePrefix(`users`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'User successfully created',
        data: instanceToInstance(user),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
