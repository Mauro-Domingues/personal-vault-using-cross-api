import {
  Transporter,
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import { IMailTemplateProviderDTO } from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

import { mailConfig } from '@config/mail';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProviderDTO } from '../models/IMailProvider';

@injectable()
export class NodemailerMailProvider implements IMailProviderDTO {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private readonly mailTemplateProvider: IMailTemplateProviderDTO,
  ) {
    this.createClient();
  }

  private async createClient(): Promise<void> {
    const account = await createTestAccount();

    this.client = createTransport({
      host: mailConfig.config.host || account.smtp.host,
      port: mailConfig.config.port || account.smtp.port,
      secure: process.env.MAIL_SECURE
        ? mailConfig.config.secure
        : account.smtp.secure,
      auth: {
        user: mailConfig.config.user || account.user,
        pass: mailConfig.config.password || account.pass,
      },
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    if (!this.client) {
      await this.createClient();
    }

    const { email, name } = mailConfig.defaults.from;

    const message = await this.client.sendMail({
      from: {
        name: from?.name ?? name,
        address: from?.email ?? email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', getTestMessageUrl(message));
  }
}
