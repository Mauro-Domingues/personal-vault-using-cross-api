import { ISendMailDTO } from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import { NodemailerMailProvider } from '@shared/container/providers/MailProvider/implementations/NodemailerMailProvider';
import { mailConfig } from '@config/mail';
import { SESMailProvider } from '@shared/container/providers/MailProvider/implementations/SESMailProvider';
import { container } from 'tsyringe';
import { IMailProviderDTO } from '@shared/container/providers/MailProvider/models/IMailProvider';

const mailProviders = {
  nodemailer: NodemailerMailProvider,
  ses: SESMailProvider,
};

export class Email {
  public static get key(): string {
    return 'Email';
  }

  public async handle({ data }: { data: ISendMailDTO }): Promise<void> {
    const mailProvider = container.resolve<IMailProviderDTO>(
      mailProviders[mailConfig.driver],
    );

    return mailProvider.sendMail(data);
  }
}
