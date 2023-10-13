import { resolve } from 'path';
import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICryptoProviderDTO } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { Route, Tags, Post, Body, Inject } from 'tsoa';
import { IQueueProviderDTO } from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { Email } from '@jobs/Email';
import { ISendMailDTO } from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import { IUsersRepositoryDTO } from '../../repositories/IUsersRepository';

@Route('/password-forgot')
@injectable()
export class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepositoryDTO,

    @inject('QueueProvider')
    private readonly queueProvider: IQueueProviderDTO,

    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProviderDTO,
  ) {}

  @Post()
  @Tags('User')
  public async execute(
    @Body() email: string,
    @Inject() ip: string,
  ): Promise<void> {
    const trx = MysqlDataSource(process.env.MYSQL_DATABASE).createQueryRunner();

    await trx.startTransaction();
    try {
      const user = await this.usersRepository.findBy(
        { where: { email }, select: { id: true, email: true, name: true } },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_EXISTS', 'User does not exist');
      }

      const { jwt_token } = await this.cryptoProvider.generateJwt(
        {
          user_id: user.id,
        },
        ip,
      );

      const forgotPasswordTemplate = resolve(
        __dirname,
        '..',
        '..',
        'views',
        'forgotPassword.hbs',
      );

      await this.queueProvider.execute<ISendMailDTO>(
        Email.key,
        {
          to: {
            name: user.name ?? '',
            email: user.email,
          },
          subject: '[CROSS API] Password recovery',
          templateData: {
            file: forgotPasswordTemplate,
            variables: {
              name: user.name ?? '',
              link: `${process.env.WEB_URL}/passwords/reset?token=${jwt_token}`,
            },
          },
        },
        3,
      );

      if (trx.isTransactionActive) await trx.commitTransaction();
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
