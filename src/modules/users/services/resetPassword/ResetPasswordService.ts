import { injectable, inject } from 'tsyringe';
import { verify } from 'jsonwebtoken';
import { resolve } from 'path';
import { readFileSync } from 'fs';

import { AppError } from '@shared/errors/AppError';
import { IHashProviderDTO } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { Route, Tags, Post, Body, Query } from 'tsoa';

@Route('/password-reset')
@injectable()
export class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('HashProvider')
    private readonly hashProvider: IHashProviderDTO,
  ) {}

  @Post('{token}')
  @Tags('User')
  public async execute(
    @Body() password: string,
    @Query() token: string,
  ): Promise<void> {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      const basePath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'assets',
        'keys',
        'private.pem',
      );

      const secret = readFileSync(basePath, 'ascii');
      const decoded = verify(token, secret);
      const { sub } = decoded;

      const user = await this.usersRepository.findBy(
        {
          where: { id: sub as string },
          select: { id: true, password: true },
        },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
      }

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.update(user, trx);
      if (trx.isTransactionActive) await trx.commitTransaction();
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
