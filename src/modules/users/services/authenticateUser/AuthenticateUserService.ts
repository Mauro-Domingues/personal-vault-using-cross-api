import { injectable, inject } from 'tsyringe';

import { ICacheProviderDTO } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { AppError } from '@shared/errors/AppError';
import { IHashProviderDTO } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { ICryptoProviderDTO } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { ITokensRepositoryDTO } from '@modules/users/repositories/ITokensRepository';
import { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { QueryRunner } from 'typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { createHash } from 'crypto';
import { Route, Tags, Post, Body } from 'tsoa';

@Route('/login')
@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('TokensRepository')
    private readonly tokensRepository: ITokensRepositoryDTO,

    @inject('HashProvider')
    private readonly hashProvider: IHashProviderDTO,

    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProviderDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProviderDTO,
  ) {}

  private async generateByToken(
    trx: QueryRunner,
    refresh_token: string,
    ip: string,
  ): Promise<{
    jwt_token: string;
  }> {
    const token = await this.tokensRepository.findBy(
      { where: { token: refresh_token }, select: { userID: true } },
      trx,
    );

    if (!token) {
      throw new AppError('INVALID_TOKEN', 'Invalid token', 401);
    }

    if (refresh_token !== createHash('sha256').update(ip).digest('hex')) {
      throw new AppError(
        'FORBIDDEN',
        'You do not have access to this route',
        403,
      );
    }

    const {
      jwt_token,
    }: {
      jwt_token: string;
      refresh_token?: string;
    } = await this.cryptoProvider.generateJwt({}, ip, {
      subject: token.userID,
    });

    return { jwt_token };
  }

  private async generateByEmail(
    trx: QueryRunner,
    email: string,
    password: string,
    ip: string,
  ): Promise<{
    jwt_token: string;
    refresh_token: string;
  }> {
    const checkUser = await this.usersRepository.findBy(
      { where: { email }, select: { id: true, password: true } },
      trx,
    );

    if (!checkUser) {
      throw new AppError(
        'INVALID_LOGIN',
        'Invalid email/password combination',
        401,
      );
    }

    const checkPassword = await this.hashProvider.compareHash(
      password,
      checkUser.password,
    );

    if (!checkPassword) {
      throw new AppError(
        'INVALID_LOGIN',
        'Invalid email/password combination',
        401,
      );
    }

    const tokens = await this.cryptoProvider.generateJwt({}, ip, {
      subject: checkUser.id,
    });

    const checkToken = await this.tokensRepository.findBy(
      { where: { userID: checkUser.id }, select: { id: true, token: true } },
      trx,
    );

    if (!checkToken) {
      await this.tokensRepository.create(
        {
          userID: checkUser.id,
          token: tokens.refresh_token,
        },
        trx,
      );
    } else {
      checkToken.token = tokens.refresh_token;
      await this.tokensRepository.update(checkToken, trx);
    }

    return tokens;
  }

  @Post()
  @Tags('User')
  public async execute(
    @Body() { email, password, ip, refresh_token }: IAuthDTO,
  ): Promise<
    IResponseDTO<{
      jwt_token: string;
      refresh_token?: string;
    }>
  > {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      let tokens: {
        jwt_token: string;
        refresh_token?: string;
      };

      if (refresh_token) {
        tokens = await this.generateByToken(trx, refresh_token as string, ip);
      } else {
        tokens = await this.generateByEmail(trx, email, password, ip);
      }

      await this.cacheProvider.invalidatePrefix('users');
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'AUTHENTICATED',
        message: 'Successfully authenticated user',
        data: tokens,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
